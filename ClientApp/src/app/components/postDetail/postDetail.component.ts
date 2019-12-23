// import { Component } from '@angular/core';
import { Post } from '../../models/post';
import { User } from '../../models/user';
import { Tag } from '../../models/tag';
import { PostService } from '../../services/post.service';
import { UserService } from 'src/app/services/user.service';
import { reject } from 'q';
import * as _ from 'lodash';
import { Router } from '@angular/router';
//import { MatDialog, MatSnackBar } from '@angular/material';
import { EditPostComponent } from '../edit-post/edit-post.component';
import { MatTableState } from 'src/app/helpers/mattable.state';


import { Component, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatSnackBar } from '@angular/material';


@Component({
  selector: 'app-postDetail',
  templateUrl: './postDetail.component.html',
  styleUrls: ['./postDetail.component.css']
})

export class PostDetailComponent {
  public post: Post;
  public score: number;
  public author: string;
  public answers: Post[] = [];
  dataSource: MatTableDataSource<Post> = new MatTableDataSource();
  state: MatTableState;

  constructor(public postService: PostService, userService: UserService, public router: Router, public dialog: MatDialog, public snackBar: MatSnackBar) {
    this.getQuestion()
    .then(() => {
      this.score = postService.score;
    }, () => console.log('fail: score'))
    .then(() => {
      userService.getById(this.post.authorId).subscribe(u => this.author = new User(u).pseudo);
    },
      () => console.log('fail: author'))
    .then(() => {
      postService.getAllAnswers().subscribe(a => {
        this.answers = a;
        this.answers.forEach(element => {
          postService.getAllComments(element.id).subscribe(c => element.comments = c);
          userService.getById(element.authorId).subscribe(u => element.author = new User(u).pseudo)
        });
      });
    }, () => console.log('fail: answers'))
  }

  getQuestion() {
    let timeout: NodeJS.Timeout;
    clearTimeout(timeout);
    return new Promise(resolve => {
      timeout = setTimeout(() => {
        this.post = this.postService.post;
        if (this.post != null)
          resolve('ok');
        else
          reject(this.router.navigate(['/']));
      }, 300);
    })
  }

  edit(post: Post) {

    console.log('XXXXXXXXXXXXXXXXXX: ' + post.id.toString());
    //post : this.post;
    const dlg = this.dialog.open(EditPostComponent, { data: { post, isNew: false } });
    dlg.beforeClose().subscribe(res => {
      if (res) {
        _.assign(post, res);
        this.postService.update(res).subscribe(res => {
          if (!res) {
            this.snackBar.open(`There was an error at the server. The update has not been done! Please try again.`, 'Dismiss', { duration: 10000 });
            this.refresh();
          }
        });
      }
    });
  }


  refresh() {
    this.postService.getAllPosts().subscribe(posts => {
      // assigne les données récupérées au datasource
      this.dataSource.data = posts;
      // restaure l'état du datasource (tri et pagination) à partir du state
      this.state.restoreState(this.dataSource);
    });
  }


  // appelée quand on clique sur le bouton "delete" d'un membre
  // delete(user: User) {
  //     const backup = this.dataSource.data;
  //     this.dataSource.data = _.filter(this.dataSource.data, u => u.id !== user.id);
  //     const snackBarRef = this.snackBar.open(`User '${user.pseudo}' will be deleted`, 'Undo', { duration: 10000 });
  //     snackBarRef.afterDismissed().subscribe(res => {
  //         if (!res.dismissedByAction)
  //             this.userService.delete(user).subscribe();
  //         else
  //             this.dataSource.data = backup;
  //     });
  // }

}