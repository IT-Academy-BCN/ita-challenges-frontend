import { Injectable, inject } from '@angular/core'
import { type HttpRequest, type HttpHandler, type HttpEvent, type HttpInterceptor } from '@angular/common/http'
import { type Observable } from 'rxjs'
import { TokenService } from '../services/token.service'

// const AUTHORIZATION = environment.AUTHORIZATION
// const BEARER = environment.BEARER
// const TOKEN = environment.BACKEND_TOKEN

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptor implements HttpInterceptor {
  private readonly tokenService = inject(TokenService)

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
