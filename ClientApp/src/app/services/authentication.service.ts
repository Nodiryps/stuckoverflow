import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    public currentUser: User;

    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {
        // au départ on récupère un éventuel utilisateur stocké dans le sessionStorage
        const data = JSON.parse(sessionStorage.getItem('currentUser'));
        this.currentUser = data ? new User(data) : null;
    }

    login(pseudo: string, password: string) {
        return this.http.post<User>(`${this.baseUrl}api/users/authenticate`, {pseudo, password})
            .pipe(map(user => {
                user = new User(user);
                if(user && user.token) {
                    sessionStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUser = user;
                }
                return user;
            }));
    }

    logout() {
        sessionStorage.removeItem('currentUser');
        this.currentUser = null;
    }
}