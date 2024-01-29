import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from "rxjs/operators";
import { AuthService } from '../services/auth.service';

const AUTHORIZATION = environment.AUTHORIZATION;
const BEARER = environment.BEARER;
const TOKEN = environment.BACKEND_TOKEN;

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptor implements HttpInterceptor {


  constructor(private router: Router,
              private authService: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const currentUser = this.authService.currentUser;

    console.log("~~~~~~~~~~~"+JSON.stringify(currentUser));

    this.authService.user.subscribe((user) => {
        console.log("#########"+JSON.stringify(user));
    });

    return next.handle(request);
  }
}
export const interceptorProvider = [{provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true}];
