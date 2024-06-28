import { Inject, Injectable } from '@angular/core'
import { CookieService } from 'ngx-cookie-service'
// import { environment } from 'src/environments/environment'
// import jwt from 'jsonwebtoken'

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  constructor (@Inject(CookieService) private readonly cookieService: CookieService) { }

  public set authToken (token: string) {
    this.cookieService.set('authToken', token)
  }

  public get authToken (): string {
    return this.cookieService.get('authToken')
  }

  public set refreshToken (token: string) {
    this.cookieService.set('authToken', token)
  }

  public get refreshToken (): string {
    return this.cookieService.get('refreshToken')
  }

  public clearTokens (): void {
    this.cookieService.set('authToken', '')
    this.cookieService.set('refreshToken', '')
  }

  public isTokenExpired (token: string): boolean {
    const expiry = JSON.parse(atob(token.split('.')[1])).exp
    return Math.floor(new Date().getTime() / 1000) >= expiry
  }

  /* See if token is valid */
  public isTokenValid (token: string): boolean {
    /* try {
      jwt.verify(token, environment.BACKEND_SSO_VALIDATE_TOKEN_URL)
      return true
    } catch (err) {
      return false
    } */
    return true
  }

  /* return if token valid */
  async checkToken (token: string): Promise<boolean> {
    return this.isTokenValid(token) && !this.isTokenExpired(token)
  }
}
