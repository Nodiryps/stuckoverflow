import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Tag } from '../models/tag';
import { map, flatMap, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TagService {
    constructor(private http: HttpClient,
        @Inject('BASE_URL') private baseUrl: string) { }

    getAll() {
        return this.http.get<Tag[]>(`${this.baseUrl}api/tags`).pipe(
            map(res => res.map(u => new Tag(u)))
        );
    }

    getById(id: number) {
        return this.http.get<Tag>(`${this.baseUrl}api/tags/id/${id}`).pipe(
            map(u => !u ? null : new Tag(u)),
            catchError(err => of(null))
        );
    }

    public update(u: Tag): Observable<boolean> {
        return this.http.put<Tag>(`${this.baseUrl}api/tags/${u.name}`, u).pipe(
            map(res => true),
            catchError(err => {
                console.error(err + ' update');
                return of(false);
            })
        );
    }

    public delete(u: Tag): Observable<boolean> {
        return this.http.delete<boolean>(`${this.baseUrl}api/tags/${u.name}`).pipe(
            map(res => true),
            catchError(err => {
                console.error(err + ' delete');
                return of(false);
            })
        );
    }

    public add(u: Tag): Observable<boolean> {
        return this.http.post<Tag>(`${this.baseUrl}api/tags`, u).pipe(
            map(res => true),
            catchError(err => {
                console.error(err + ' add');
                return of(false);
            })
        );
    }
}