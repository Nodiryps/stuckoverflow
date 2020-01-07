import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, flatMap } from 'rxjs/operators';
import { User, Role } from '../models/user';
import { Observable } from 'rxjs';
import { Post } from '../models/post';
import { Comment } from '../models/comment';


@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    public currentUser: User;

    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {
        // au départ on récupère un éventuel utilisateur stocké dans le sessionStorage
        const data = JSON.parse(sessionStorage.getItem('currentUser'));
        this.currentUser = data ? new User(data) : null;
    }

    isAdmin() {
        return this.currentUser.role === Role.Admin;
    }

    isTheAuthorOfAPost(post: Post) {
        return this.currentUser.id === post.authorId;
    }

    isTheAuthorOfAComment(comment: Comment) {
        return this.currentUser.id === comment.authorId;
    }

    login(pseudo: string, password: string) {
        return this.http.post<User>(`${this.baseUrl}api/users/authenticate`, { pseudo, password })
            .pipe(map(user => {
                user = new User(user);
                if (user && user.token) {
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

    // public isPseudoAvailable(pseudo: string): Observable<boolean> {
    //     return this.http.get<boolean>(`${this.baseUrl}api/users/availablePseudo/${pseudo}`);
    // }

    // public isEmailAvailable(email: string): Observable<boolean> {
    //     return this.http.get<boolean>(`${this.baseUrl}api/users/availableEmail/${email}`);
    // }

    public isAvailable(pseudo: string, email: string): Observable<boolean> {
        if (pseudo !== '')
            return this.http.get<boolean>(`${this.baseUrl}api/users/available/${pseudo}`);
        else
            return this.http.get<boolean>(`${this.baseUrl}api/users/available/${email}`);
    }

    public signup(pseudo: string, password: string, email: string, firstname: string, lastname: string, birthdate: string): Observable<User> {
        return this.http.post<User>(`${this.baseUrl}api/users/signup`, { pseudo: pseudo, password: password, email: email, firstname: firstname, lastname: lastname, birthdate: birthdate }).pipe(
            flatMap(res => this.login(pseudo, password)),
        );
    }
}