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

export class PostDetailComponent implements OnDestroy {
  frm: FormGroup;
  ctlReply: FormControl;
  post: Post;
  score: number;
  currScore: number;
  scoreHistory: string[] = [];
  author: string;
  answers: Post[] = [];
  dataSource: MatTableDataSource<Post> = new MatTableDataSource();
  state: MatTableState;
  currUser: User;
  alreadyVotedUp: boolean = false;
  alreadyVotedDown: boolean = false;
  undoableVote: boolean = false;
  subscription: Subscription;

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
    this.currUser = authenticationService.currentUser;
    this.post = new Post({});
    this.getQuestion()
      .then(() => {
        
        this.subscription = counterService.counter$.subscribe(c => {
          this.currScore = c;
          this.score = postService.score;
          counterService.score = this.score;
        })
      })
      .then(() => {
        userService.getById(this.post.authorId).subscribe(
          u => this.author = new User(u).pseudo);
      })
      .then(() => {
        postService.getAllAnswers().subscribe(a => {
          this.answers = a;
          this.answers.forEach(element => {
            postService.getAllComments(element.id).subscribe(c => element.comments = c);
            userService.getById(element.authorId).subscribe(u => element.author = new User(u).pseudo)
          });
        });
      })

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

  voteUp() {
    if (!this.alreadyVotedUp) {
      this.vote();
      this.counterService.increment();
      this.alreadyVotedUp = true;
      this.alreadyVotedDown = false;
      this.undoableVote = true;
    }
  }

  voteDown() {
    if (!this.alreadyVotedDown) {
      this.vote();
      this.counterService.decrement();
      this.alreadyVotedUp = false;
      this.alreadyVotedDown = true;
      this.undoableVote = true;
    }
  }

  voteUndo() {
    if (this.undoableVote) {
      this.counterService.reset();
      this.alreadyVotedDown = false;
      this.alreadyVotedUp = false;
      this.undoableVote = false;
    }
  }

  ngOnDestroy() {
    new Promise(() => {
      this.vote();
      this.counterService.reset();
    })
      .then(() => this.subscription.unsubscribe())
      .catch(err => console.log(err))
  }

  private vote() {
    if (this.post !== null) {
      if (this.alreadyVotedDown || this.alreadyVotedUp) {
        this.post.votes.splice(this.post.votes.length - 1, 1); // if alreadyVoted, del last vote
      }
      let newVote = new Vote({});
      newVote.authorId = this.currUser.id;
      newVote.postId = this.post.id;
      newVote.upDown = this.score - this.currScore;

      this.post.votes.push(newVote);
      this.postService.update(this.post);
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

  showDetail(post: Post) {
    this.postService.setPostDetail(post);
    this.router.navigate([`/postdetail`]);
  }

  refreshPost() {
    this.postService.getAllAnswers().subscribe(a => {
      this.answers = a;
      this.answers.forEach(element => {
        this.postService.getAllComments(element.id).subscribe(c => element.comments = c);
        this.userService.getById(element.authorId).subscribe(u => element.author = new User(u).pseudo)
      });
    });
    this.ctlReply.setValue('');
  }

  refresh() {
    this.postService.getAllQuestions().subscribe(posts => {
      // assigne les données récupérées au datasource
      this.dataSource.data = posts;
      // restaure l'état du datasource (tri et pagination) à partir du state
      this.state.restoreState(this.dataSource);
    });
  }
}