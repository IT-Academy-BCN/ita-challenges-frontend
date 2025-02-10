import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { BehaviorSubject, type Observable } from 'rxjs'
import { User } from '../models/user.model'
import { Router } from '@angular/router'
import { CookieService } from 'ngx-cookie-service'
import { Inject, Injectable } from '@angular/core'

interface UserResponse {
  dni: string
  email: string
  role: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly anonym: string = 'anonym'
  private readonly userSubject: BehaviorSubject<User>
  public user$: Observable<User>

  constructor (
    @Inject(HttpClient) private readonly http: HttpClient,
    @Inject(Router) private readonly router: Router,
    @Inject(CookieService) private readonly cookieService: CookieService
  ) {
    // private helper: CookieEncryptionHelper) {

    // Verificar si la cookie 'user' está definida
    const userCookie = this.cookieService.get('user')
    const initialUser = (userCookie !== null && userCookie !== undefined && userCookie !== '') ? JSON.parse(userCookie) : null

    this.userSubject = new BehaviorSubject(initialUser)
    this.user$ = this.userSubject.asObservable()
  }

  /**
   * Creates a new anonymous user if there is no user in the cookies.
   */
  public get currentUser (): User {
    if (this.userSubject.value === null) {
      this.userSubject.next(new User(this.anonym))
      this.cookieService.set('user', this.anonym)
    }
    return this.userSubject.value
  }

  public set currentUser (user: User) {
    this.userSubject.next(user)
    this.cookieService.set('user', JSON.stringify(user))
  }

  public logout (): void {
    this.cookieService.delete('authToken')
    this.cookieService.delete('refreshToken')
    this.cookieService.delete('user')
    this.currentUser = new User(this.anonym) // Asignar un nuevo usuario anónimo
    void this.router.navigate(['/login']) // Usar void para marcar la promesa como explícitamente ignorada
  }
  /**
   * get User Data
   * and store it in the cookie
   */

  public async getLoggedUserData (): Promise<UserResponse> {
    return await new Promise<UserResponse>((resolve, reject) => {
      this.http
        .post<UserResponse>(environment.BACKEND_ITA_SSO_BASE_URL.concat(environment.BACKEND_SSO_POST_USER), {
        authToken: this.cookieService.get('authToken')
      })
        .subscribe({
          next: (res) => {
            const user: User = this.currentUser

            const userData: User = {
              idUser: user.idUser,
              dni: res.dni,
              email: res.email
            }

            this.currentUser = userData
            resolve(res)
          },
          error: (err) => {
            console.error('Error in getLoggedUserData:', err) // Asegúrate de que el error se registra
            reject(err.message)
          }
        })
    })
  }
}
