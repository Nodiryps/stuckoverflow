import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../models/user';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }
    getAll() {
        return this.http.get<User[]>(`${this.baseUrl}api/users`)
            .pipe(map(res => res.map(u => new User(u))));
    }
}