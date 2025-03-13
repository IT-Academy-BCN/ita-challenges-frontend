import { Injectable, inject } from '@angular/core'
import { type HttpRequest, type HttpHandler, type HttpEvent, type HttpInterceptor } from '@angular/common/http'
import { type Observable } from 'rxjs'
// import { TokenService } from '../services/token.service'
import { environment } from 'src/environments/environment'
import { CookieService } from 'ngx-cookie-service'

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptor implements HttpInterceptor {
  private readonly cookieService = inject(CookieService)

  intercept (request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token: string = this.cookieService.get('authToken')
    const isApiUrl = request.url.startsWith(environment.BACKEND_ITA_CHALLENGE_BASE_URL)
    if (isApiUrl && token !== '') {
      // Agregar el token al encabezado Authorization
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      })
    }

    return next.handle(request)
  }
}
