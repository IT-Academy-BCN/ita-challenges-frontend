import { Injectable, inject } from '@angular/core'
import { CookieService } from 'ngx-cookie-service'

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly cookieService = inject(CookieService)

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

  // Check if the token is expired
  public isTokenExpired (token: string): boolean {
    const expiry = JSON.parse(atob(token.split('.')[1])).exp
    return Math.floor(new Date().getTime() / 1000) >= expiry
  }

  /* See if token is valid */
  public isTokenValid (token: string): boolean { // todo: Promise<boolean>
    return true
  }

  /* return if token valid */
  async checkToken (token: string): Promise<boolean> {
    return true
  }
}
