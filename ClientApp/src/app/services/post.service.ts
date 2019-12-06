import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from '../models/post';
import { Tag } from '../models/tag';
import { map, flatMap, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PostService {
    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

    getAllPosts() {
        return this.http.get<Post[]>(`${this.baseUrl}api/posts`).pipe(
            map(res => res.map(p => new Post(p)))
        );
    }

    getAllTags() {
        return this.http.get<Tag[]>(`${this.baseUrl}api/posts`).pipe(
            map(res => res.map(p => new Post(p).tags))
        );
    }

      
  public add(p: Post): Observable<boolean> {
    return this.http.post<Post>(`${this.baseUrl}api/posts`, p).pipe(
      map(res => true),
      catchError(err => {
        console.error(err + ' add');
        return of(false);
      })
    );
  }

public create(title: string, body: string): Observable<Post> {
  return this.http.post<Post>(`${this.baseUrl}api/posts/create-post`, { title: title, body: body}).pipe();
}


}