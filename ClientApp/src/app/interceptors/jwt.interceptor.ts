import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, flatMap } from 'rxjs/operators';

import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService, private router: Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let currentUser = this.authenticationService.currentUser;
        if(currentUser && currentUser.token)
            req = this.addToken(req, currentUser.token);
        return next.handle(req).pipe(catchError(err => {
            if(err.status === 401 && err.headers.get("token-expired"))
                return this.handle401Error(req, next);
            else
                return throwError(err);
        }));
    }

    private handle401Error(req: HttpRequest<any>, next: HttpHandler) {
        this.authenticationService.logout();
        this.router.navigateByUrl("/login");
        return next.handle(null);
    }

    private addToken(req: HttpRequest<any>, token: string) {
        return req.clone({ 
            setHeaders: { 'Authorization': `Bearer ${token}` } 
        });
    }
}