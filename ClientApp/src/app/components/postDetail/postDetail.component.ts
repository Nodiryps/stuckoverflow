import { Component } from '@angular/core';
import { Post } from '../../models/post'
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-postDetail',
  templateUrl: './postDetail.component.html',
  styleUrls: ['./postDetail.component.css']
})

export class PostDetailComponent {
  public post: Post;

  constructor(postService: PostService) {
    this.post = postService.post;
    console.log( this.post);
  }
}