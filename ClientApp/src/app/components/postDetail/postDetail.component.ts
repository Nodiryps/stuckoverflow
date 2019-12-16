import { Component } from '@angular/core';
import { Post } from '../../models/post';
import { User } from '../../models/user';
import { Tag } from '../../models/tag';
import { PostService } from '../../services/post.service';
import { UserService } from 'src/app/services/user.service';
import { reject } from 'q';
import { Router } from '@angular/router';


@Component({
  selector: 'app-postDetail',
  templateUrl: './postDetail.component.html',
  styleUrls: ['./postDetail.component.css']
})

export class PostDetailComponent {
  public post: Post;
  public score: number;
  public author: string;
  public tags: Tag[];
  public answers: Post[] = [];

  constructor(public postService: PostService, userService: UserService, public router: Router) {
    this.getQuestion(postService)
      .then(() => { this.score = postService.score; }, () => console.log('fail: score'))
      .then(() => { userService.getById(this.post.authorId).subscribe(u => this.author = new User(u).pseudo); },
        () => console.log('fail: author'))
      .then(() => {
        postService.getAllAnswers().subscribe(a => {
          this.answers = a;
          this.answers.forEach(element => {
            postService.getAllComments(element.id).subscribe(c => element.comments = c);
          });
        });
      }, () => console.log('fail: answers'))

    // .then(() => { postService.getAllTags().subscribe(t => this.tags = t) }, 
    //       () => console.log('fail: tags'))
  }

  getQuestion(serv: PostService) {
    let timeout: NodeJS.Timeout;
    clearTimeout(timeout);
    return new Promise(resolve => {
      timeout = setTimeout(() => {
        this.post = serv.post;
        if(this.post != null)
          resolve('ok');
        else
          reject(this.router.navigate(['/']));
      } , 300);
    })
  }
}