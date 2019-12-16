import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from '../models/post';
import { Tag } from '../models/tag';
import { Comment } from '../models/comment';
import { map, flatMap, catchError } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PostService {
  public post: Post;
  public score: number = 0;
  public tags: Tag[];
  public answers: Post[];
  public comments: Comment[];

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {  }

  getAllPosts() {
    return this.http.get<Post[]>(`${this.baseUrl}api/posts`).pipe(
      map(res => res.map(p => new Post(p)))
    );
  }

  // getPost(post: Post) {
  //   return this.http.get<Post>(`${this.baseUrl}api/posts/${post.id}`).pipe(
  //     map(p => !p ? null : new Post(p)),
  //     catchError(err => of(null))
  //   );
  // }

  setScore() {
    this.score = 0;
    this.post.votes.forEach(v => {
      this.score += v.upDown;
    });
  }

  setPostDetail(p: Post) {
    this.post = p;
    this.setScore();
  }

  getAllTags() {
    return this.http.get<Tag[]>(`${this.baseUrl}api/posts/tags/${this.post.id}`).pipe(
      map(res => res.map(t => new Tag(t)))
    );
  }

  getAllAnswers() {
    return this.http.get<Post[]>(`${this.baseUrl}api/posts/answers/${this.post.id}`).pipe(
      map(res => res.map(p => new Post(p)))
    );
  }

  getAllComments(id: number) {
    return this.http.get<Comment[]>(`${this.baseUrl}api/posts/comments/${id}`).pipe(
      map(res => res.map(c => new Comment(c)))
    );
  }

  public add(p: Post): Observable<boolean> {
    return this.http.post<Post>(`${this.baseUrl}api/posts`, p).pipe(
      map(res => true),
      catchError(err => {
        console.error(err);
        return of(false);
      })
    );
  }
}