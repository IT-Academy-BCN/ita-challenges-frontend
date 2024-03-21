import { Router } from '@angular/router'
import { Injectable, Injector } from '@angular/core'
import { environment } from 'src/environments/environment'
import { type HttpRequest, type HttpHandler, type HttpEvent, type HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http'
import { type Observable, throwError } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'
import { AuthService } from '../services/auth.service'
import { type TokenService } from '../services/token.service'

const AUTHORIZATION = environment.AUTHORIZATION
const BEARER = environment.BEARER
const TOKEN = environment.BACKEND_TOKEN

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptor implements HttpInterceptor {
  constructor (private readonly tokenService: TokenService) { }

  intercept (request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // const token = this.authService.getToken();

    /*    let authService = this.injector.get(AuthService);

    const isApiUrl = request.url.startsWith(environment.BACKEND_ITA_CHALLENGE_BASE_URL);

      const token = authService.getToken();

      if (isApiUrl && token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true // cookies allowed
      });
    } */

    return next.handle(request)
  }
}
// export const interceptorProvider = [{provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true}];
