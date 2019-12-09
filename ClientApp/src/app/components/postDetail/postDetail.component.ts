import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Post } from '../../models/post'
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-postDetail',
  templateUrl: './postDetail.component.html',
  styleUrls: ['./postDetail.component.css']
})

export class PostDetailComponent {
  
  
  constructor(postService: PostService) { }
}