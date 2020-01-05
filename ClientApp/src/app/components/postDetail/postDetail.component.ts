import { Post } from '../../models/post';
import { User, Role } from '../../models/user';
import { Tag } from '../../models/tag';
import { Vote } from 'src/app/models/vote';
import { PostService } from '../../services/post.service';
import { UserService } from 'src/app/services/user.service';
import { CounterService } from 'src/app/services/counter.service';
import { Comment } from '../../models/comment';
import { EditCommentComponent } from '../edit-comment/edit-comment.component';

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
  frmComment: FormGroup;
  ctlComment: FormControl;
  post: Post;
  author: User;
  answers: Post[] = [];
  dataSource: MatTableDataSource<Post> = new MatTableDataSource();
  state: MatTableState;
  currUser: User;
  reputationToVoteUp = 15;
  reputationToVoteDown = 30;
  reputationMin = 0;

  constructor(
    private postService: PostService,
    private userService: UserService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private authService: AuthenticationService
  ) {
    if (authService.currentUser !== null)
      this.currUser = authService.currentUser;
    this.post = new Post({});
    this.author = new User({});
    this.getQuestion()
      .then(() => {
        this.post.currScore = this.post.score = postService.score;
      })
      .then(() => {
        userService.getById(this.post.authorId).subscribe(
          u => this.author = new User(u));
      })
      .then(() => {
        this.refreshPost();
      })

    this.ctlReply = this.fb.control('',
      [
        Validators.required,
      ]
    );

    this.frm = this.fb.group({
      body: this.ctlReply,
    });

    this.ctlComment = this.fb.control('',
      [
        //Validators.required,
      ]
    );

    this.frmComment = this.fb.group({
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

  isCurrUserReputationOK(repMin: number) {
    return this.currUser.reputation >= repMin;
  }

  voteUp(post: Post) {
    if (this.isCurrUserReputationOK(this.reputationToVoteUp) &&
      !post.alreadyVotedUp) {
      this.vote(post, 1);
      post.currScore = post.score + 1;

      post.alreadyVotedUp = true;
      post.alreadyVotedDown = false;
      post.undoableVote = true;

      post.author.reputation += 10;
    }
    else if (!this.isCurrUserReputationOK(this.reputationToVoteUp))
      this.snackBar.open(`Can't vote. Your reputation is < ` + this.reputationToVoteUp, 'Dismiss', { duration: 10000 });
  }

  voteDown(post: Post) {
    if (this.isCurrUserReputationOK(this.reputationToVoteDown) &&
      !post.alreadyVotedDown) {
      this.vote(post, -1);
      post.currScore = post.score - 1;

      post.alreadyVotedUp = false;
      post.alreadyVotedDown = true;
      post.undoableVote = true;

      post.author.reputation += -2;
      this.currUser.reputation += -1;
    }
    else if (!this.isCurrUserReputationOK(this.reputationToVoteDown))
      this.snackBar.open(`Can't vote. Your reputation is < ` + this.reputationToVoteDown, 'Dismiss', { duration: 10000 });
  }

  voteUndo(post: Post) {
    if (post.undoableVote) {
      this.undoVote(post);
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
      let newVote = new Vote({});
      newVote.authorId = this.authService.currentUser.id;
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

  accept(answer: Post) {
    if (this.isCurrUserReputationOK(this.reputationMin) &&
      this.authService.isTheAuthorOfAPost(this.post)) {
      const acceptedAnswer = this.answers.find(a => this.post.acceptedAnswerId === a.id);
      if (acceptedAnswer != undefined) {
        this.post.acceptedAnswerId = null;
      }
      this.post.acceptedAnswerId = answer.id;

      answer.author.reputation += 15;
      this.post.author.reputation += 2;

      this.postService.update(this.post).subscribe(res => {
        if (!res) {
          this.snackBar.open(`Theres was an error at the server. 
            The update has not been done! Please try again.`, 'Dismiss', { duration: 10000 });
        }
      });

      this.refreshPost();
    }
    else if (this.isCurrUserReputationOK(this.reputationMin)) {
      this.snackBar.open(`Can't accept. Your reputation is < ` + this.reputationMin, 'Dismiss', { duration: 10000 });
    }
    else
      this.snackBar.open(`You have to be the author of the question to an answer.` + this.reputationMin, 'Dismiss', { duration: 10000 });
  }

  edit(post: Post, isComment: boolean, isAnswer: boolean) {
    const dlg = this.dialog.open(EditPostComponent, { data: { post, isNew: false, isComment: isComment, isAnswer: isAnswer } });
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
    this.refreshPost();
  }

  comment(post: Post) {
    const newComment = new Comment({});
    newComment.authorId = this.currUser.id;
    newComment.postId = post.id;
    console.log('ID:  ' + newComment.authorId)
    const dlg = this.dialog.open(EditCommentComponent, { data: { newComment, isNew: true, isComment: true, isAnswer: false } });
    dlg.beforeClose().subscribe(res => {
      if (res) {
        _.assign(newComment, res);
        this.postService.addComment(newComment).subscribe(res => {
          if (!res) {
            this.snackBar.open(`There was an error at the server. The POST Comment has not been done! Please try again.`, 'Dismiss', { duration: 10000 });
            this.refreshPost();
          }
        });
      }
    });
  }

  editComment(comment: Comment) {
    const dlg = this.dialog.open(EditCommentComponent, { data: { comment, isNew: false, isComment: true, isAnswer: false } });
    dlg.beforeClose().subscribe(res => {
      if (res) {
        _.assign(comment, res);
        this.postService.updateComment(comment).subscribe(res => {
          if (!res) {
            this.snackBar.open(`There was an error at the server. The POST Comment has not been done! Please try again.`, 'Dismiss', { duration: 10000 });
            this.refreshPost();
          }
        });
      }
    });
  }

  delete(post: Post) {
    if (this.authService.isTheAuthorOfAPost(post) || this.authService.isAdmin()) {
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
  }

  deleteComment(comment: Comment) {
    if (this.authService.isTheAuthorOfAComment(comment) || this.authService.isAdmin()) {
      const backup = this.dataSource.data;
      //this.dataSource.data = _.filter(this.dataSource.data, p => p.id !== post.id);
      const snackBarRef = this.snackBar.open(`Comment '${comment.body}' will be deleted`, 'Undo', { duration: 10000 });
      snackBarRef.afterDismissed().subscribe(res => {
        if (!res.dismissedByAction) {
          this.postService.deleteComment(comment).subscribe();
          this.refreshPost();
        }
        else
          this.dataSource.data = backup;
      });
    }
  }

  reply() {
    const post = new Post({});

    post.body = this.ctlReply.value;
    post.authorId = this.currUser.id;
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
      let acceptedAnswer = null;

      this.answers.forEach(element => {
        if (this.post.acceptedAnswerId === element.id)
          acceptedAnswer = element;
        this.postService.getAllComments(element.id).subscribe(c => element.comments = c);
        this.userService.getById(element.authorId).subscribe(u => element.author = new User(u))
      });
      this.answers = _.orderBy(this.answers, (p => p.score), "desc");
      this.answers = _.filter(this.answers, a => this.post.acceptedAnswerId !== a.id); // to avoid duplicating accepted answers

      if (acceptedAnswer != undefined)
        this.answers.unshift(acceptedAnswer);
    });
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