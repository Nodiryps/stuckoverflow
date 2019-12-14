import { Component } from '@angular/core';
import { Post } from '../../models/post'
import { User } from '../../models/user'
import { PostService } from '../../services/post.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-postDetail',
  templateUrl: './postDetail.component.html',
  styleUrls: ['./postDetail.component.css']
})

export class PostDetailComponent {
  public post: Post;
  public score: number;
  public author: string;

  constructor(postService: PostService, userService: UserService) {
    this.post = postService.post;
    this.score = postService.score;
    this.author = String(userService.getById(this.post.authorId).subscribe(u => new User(u).pseudo));
    // this.author = userAuth.pseudo;
    console.log("auth: " + this.post.authorId.toString());
  }
}