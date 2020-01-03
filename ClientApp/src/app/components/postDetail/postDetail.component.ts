import { Post } from '../../models/post';
import { User } from '../../models/user';
import { Tag } from '../../models/tag';
import { Vote } from 'src/app/models/vote';
import { PostService } from '../../services/post.service';
import { UserService } from 'src/app/services/user.service';
import { CounterService } from 'src/app/services/counter.service';

import { reject, resolve } from 'q';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { EditPostComponent } from '../edit-post/edit-post.component';
import { MatTableState } from 'src/app/helpers/mattable.state';
import { Component, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatDialog, MatSnackBar } from '@angular/material';
import { Validators, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-postDetail',
  templateUrl: './postDetail.component.html',
  styleUrls: ['./postDetail.component.css']
})

export class PostDetailComponent { // implements OnDestroy {
  frm: FormGroup;
  ctlReply: FormControl;
  post: Post;
  acceptedAnswer: Post;
  scoreHistory: string[] = [];
  author: string;
  answers: Post[] = [];
  dataSource: MatTableDataSource<Post> = new MatTableDataSource();
  state: MatTableState;
  currUser: User;

  constructor(
    private counterService: CounterService,
    private postService: PostService,
    private userService: UserService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private authenticationService: AuthenticationService
  ) {
    if (authenticationService.currentUser !== null)
      this.currUser = authenticationService.currentUser;
    this.post = new Post({});
    this.acceptedAnswer = new Post({});
    this.getQuestion()
      .then(() => {
        counterService.counter$.subscribe(c => {
          this.post.score = c;
          // this.score = postService.score;
          counterService.score = this.post.score;
        })
      })
      .then(() => {
        userService.getById(this.post.authorId).subscribe(
          u => this.author = new User(u).pseudo);
      })
      .then(() => {
        this.refreshPost();
      })
    // .then(() => {
    //   if (this.post.acceptedAnswerId != null) {
    //     postService.getById(this.post.acceptedAnswerId).subscribe(a => {
    //       this.acceptedAnswer = a;
    //     });
    //   }
    // })
    this.ctlReply = this.fb.control('',
      [
        Validators.required,
      ]
    );

    this.frm = this.fb.group({
      body: this.ctlReply,
    });
  }

  getQuestion() {
    let timeout: NodeJS.Timeout;
    clearTimeout(timeout);
    return new Promise(resolve => {
      timeout = setTimeout(() => {
        this.post = this.postService.post;
        if (this.post != null)
          resolve();
        else
          reject(this.router.navigate(['/']));
      }, 300);
    })
  }

  // CurrUserLastVote(post: Post) {
  //   if (this.currUserAlreadyVoted(post) !== undefined) {
  //     const vote = this.currUserAlreadyVoted(post);
  //     if (vote.upDown === 1)
  //       post.alreadyVotedUp = true; // so cannot revote up
  //     else if (vote.upDown === -1)
  //       post.alreadyVotedDown = true;
  //   }
  // }

  // currUserAlreadyVoted(post: Post) {
  //   if(this.currUser !== null)
  //     return this.currUser.votes.find(v => v.postId === post.id);
  // }

  voteUp(post: Post) {
    // this.CurrUserLastVote(post);
    if (!post.alreadyVotedUp) {
      this.vote(post, 1);
      this.counterService.increment();
      post.alreadyVotedUp = true;
      post.alreadyVotedDown = false;
      post.undoableVote = true;
    }
  }

  voteDown(post: Post) {
    // this.CurrUserLastVote(post);
    if (!post.alreadyVotedDown) {
      this.vote(post, -1);
      this.counterService.decrement();
      post.alreadyVotedUp = false;
      post.alreadyVotedDown = true;
      post.undoableVote = true;
    }
  }

  voteUndo(post: Post) {
    // this.CurrUserLastVote(post);
    if (post.undoableVote) {
      this.undoVote(post);
      this.counterService.reset();
      post.currScore = post.score;
      post.alreadyVotedDown = false;
      post.alreadyVotedUp = false;
      post.undoableVote = false;
    }
  }

  private undoVote(post: Post) {
    post.votes.splice(post.votes.length - 1, 1); // del last vote
    this.postService.update(post).subscribe(res => {
      if (!res) {
        this.snackBar.open(`There was an error at the server. The update has not been done! Please try again.`, 'Dismiss', { duration: 10000 });
        this.refreshPost();
      }
    });
  }

  private vote(post: Post, vote: number) {
    if (post !== null) {

      if (Math.abs(vote) !== 1) {
        this.snackBar.open(`vote !== 1 OR -1`, 'Dismiss', { duration: 10000 });
        this.refreshPost();
      }

      let newVote = new Vote({});
      newVote.authorId = this.authenticationService.currentUser.id;
      newVote.postId = post.id;
      newVote.upDown = vote;

      post.votes.push(newVote);
      this.postService.update(post).subscribe(res => {
        if (!res) {
          this.snackBar.open(`There was an error at the server. The update has not been done! Please try again.`, 'Dismiss', { duration: 10000 });
          this.refreshPost();
        }
      });
    }
  }

  edit(post: Post) {
    const dlg = this.dialog.open(EditPostComponent, { data: { post, isNew: false } });
    dlg.beforeClose().subscribe(res => {
      if (res) {
        _.assign(post, res);
        this.postService.update(res).subscribe(res => {
          if (!res) {
            this.snackBar.open(`There was an error at the server. The update has not been done! Please try again.`, 'Dismiss', { duration: 10000 });
            this.refreshPost();
          }
        });
      }
    });
  }

  delete(post: Post) {
    const backup = this.dataSource.data;
    this.dataSource.data = _.filter(this.dataSource.data, p => p.id !== post.id);
    const snackBarRef = this.snackBar.open(`Post '${post.title}' will be deleted`, 'Undo', { duration: 10000 });
    snackBarRef.afterDismissed().subscribe(res => {
      if (!res.dismissedByAction) {
        this.postService.delete(post).subscribe();
        this.router.navigate(['/']);
        this.refresh();
      }
      else
        this.dataSource.data = backup;
    });
  }

  reply() {
    const post = new Post({});

    post.body = this.ctlReply.value;
    post.authorId = this.authenticationService.currentUser.id;
    post.parentId = this.post.id;

    this.postService.add(post).subscribe(() => {
      this.refreshPost();
    });
  }

  accept(answer: Post) {
    const acceptedAnswer = this.answers.find(a => this.post.acceptedAnswerId === a.id);
    if (acceptedAnswer != undefined) {
      this.post.acceptedAnswerId = null;
    }
    this.post.acceptedAnswerId = answer.id;
    // this.acceptedAnswer = answer;
    this.postService.update(this.post).subscribe(res => {
      if (!res) {
        this.snackBar.open(`Theres was an error at the server. 
          The update has not been done! Please try again.`, 'Dismiss', { duration: 10000 });
      }
    });
    this.refreshPost();
  }

  showDetail(post: Post) {
    this.postService.setPostDetail(post);
    this.router.navigate([`/postdetail`]);
  }

  refreshPost() {
    this.postService.getAllAnswers().subscribe(a => {
      this.answers = a;
      let acceptedAnswer = null;

      this.answers.forEach(element => {
        if (this.post.acceptedAnswerId === element.id)
          acceptedAnswer = element;
        this.postService.getAllComments(element.id).subscribe(c => element.comments = c);
        this.userService.getById(element.authorId).subscribe(u => element.author = new User(u).pseudo)
      });
      this.answers = _.orderBy(this.answers, (p => p.score), "desc");
      this.answers = _.filter(this.answers, a => this.post.acceptedAnswerId !== a.id); // to avoid duplicating accepted answers

      if (acceptedAnswer != undefined)
        this.answers.unshift(acceptedAnswer);
    });
    // if (this.post.acceptedAnswerId != null) {
    //   this.postService.getById(this.post.acceptedAnswerId).subscribe(a => {
    //     this.acceptedAnswer = a;
    //   });
    // }

    // this.postService.getAllAnswers().subscribe(a => {
    //   this.answers = a;
    //   this.answers.forEach(element => {
    //     this.postService.getAllComments(element.id).subscribe(c => element.comments = c);
    //     this.userService.getById(element.authorId).subscribe(u => element.author = new User(u).pseudo)
    //   });
    // });
    // this.ctlReply.setValue('');
    // this.answers = _.orderBy(this.answers, (p => p.score), "desc");
  }

  refresh() {
    this.postService.getAllQuestions().subscribe(posts => {
      // assigne les données récupérées au datasource
      this.dataSource.data = posts;
      // restaure l'état du datasource (tri et pagination) à partir du state
      this.state.restoreState(this.dataSource);
    });
  }

  // ngOnDestroy() {
  //   new Promise(() => {
  //     this.vote();
  //     this.counterService.reset();
  //   })
  //     .then(() => this.subscription.unsubscribe())
  //     .catch(err => console.log(err))
  // }
}