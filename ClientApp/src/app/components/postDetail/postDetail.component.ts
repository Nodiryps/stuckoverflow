import { Component } from '@angular/core';
import { Post } from '../../models/post';
import { User } from '../../models/user';
import { Comment } from '../../models/comment';
import { Tag } from '../../models/tag';
import { PostService } from '../../services/post.service';
import { UserService } from 'src/app/services/user.service';
import { Observable } from 'rxjs';

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
  public comments: Comment[];

  constructor(public postService: PostService, userService: UserService) {
    this.getQuestion(postService)
      .then(() => { this.score = postService.score; }, () => console.log('fail: score'))
      .then(() => { userService.getById(this.post.authorId).subscribe(u => this.author = new User(u).pseudo); },
            () => console.log('fail: author'))
      .then(() => { postService.getAllAnswers().subscribe(a => this.answers = a); }, 
            () => console.log('fail: answers'))
      .then(() => { this.getAllCmtsById(); },
            () => console.log('fail: comments'))
      // .then(() => { postService.getAllTags().subscribe(t => this.tags = t) }, 
      //       () => console.log('fail: tags'))
    
    console.log("COMMENTS: " + this.comments);
  }

  getAllCmtsById() {
    let arr: Post[] =  [];
    arr.push(this.post);

    this.answers.forEach(a => {
      arr.push(a);
    });

    arr.forEach(p => {
      this.postService.getAllComments(p.id).subscribe(c => this.comments = c);
    });
  }

  getQuestion(serv: PostService) {
    let timeout: NodeJS.Timeout;
    clearTimeout(timeout);
    return new Promise( resolve => {
      timeout = setTimeout(() => {
        this.post = serv.post;
        resolve(this.post != null);
      }, 300);
    })
  }
}