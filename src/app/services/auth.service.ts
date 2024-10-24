// import { add } from 'date-fns'
// import { AbstractType, Injectable } from '@angular/core'
// import { catchError, map, of, tap, throwError } from 'rxjs'
// import { ResolveEnd} from '@angular/router'
// import { fakeAsync } from '@angular/core/testing'
// import { BlobOptions } from 'buffer'
// import { error } from 'console'

import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { BehaviorSubject, type Observable, firstValueFrom } from 'rxjs'
import { User } from '../models/user.model'
import { Router } from '@angular/router'
import { CookieService } from 'ngx-cookie-service'
import { TokenService } from './token.service'
import { Inject, Injectable } from '@angular/core'

interface loginResponse {
  id: string
  authToken: string
  refreshToken: string
}

interface registerResponse {
  id: string
}

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
    @Inject(CookieService) private readonly cookieService: CookieService,
    @Inject(TokenService) private readonly tokenService: TokenService
  ) {
    // private helper: CookieEncryptionHelper) {

    // Verificar si la cookie 'user' está definida
    const userCookie = this.cookieService.get('user')
    const initialUser = (userCookie !== null && userCookie !== undefined && userCookie !== '') ? JSON.parse(userCookie) : null

    this.userSubject = new BehaviorSubject(initialUser)
    this.user$ = this.userSubject.asObservable()
    // this.userSubject = new BehaviorSubject(JSON.parse(this.cookieService.get('user')));
    // this.user$ = this.userSubject.asObservable();
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

  /**
   * Register a user and log in with the new user. Set new user as current user.
   */
  public registerRequest (user: User): Observable<any> {
    return this.http.post(
      environment.BACKEND_ITA_SSO_BASE_URL.concat(environment.BACKEND_SSO_REGISTER_URL),
      {
        dni: user.dni,
        email: user.email,
        name: user.name,
        itineraryId: user.itineraryId,
        password: user.password,
        confirmPassword: user.confirmPassword
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }

  public async register (user: User): Promise<registerResponse> {
    return await new Promise<registerResponse>((resolve, reject) => {
      this.registerRequest(user).subscribe({
        next: (resp: registerResponse) => {
          this.modifyUserWithAdmin(resp.id)
            .then(() => { resolve(resp) })
            .catch(reject)
        },
        error: (err) => {
          reject(err.error.message)
        }
      })
    })
  }

  public async modifyUserWithAdmin (registerUserId: string): Promise<void> {
    try {
      const userAdmin = await firstValueFrom(this.http.get<User>(environment.ADMIN_USER))

      if (userAdmin !== null && userAdmin !== undefined) {
        await this.login(userAdmin)
      } else {
        console.error('Admin account not found')
      }

      const userLoggedData = await this.getLoggedUserData()
      if (userLoggedData.role === 'ADMIN') {
        await firstValueFrom(
          this.http.patch(
            environment.BACKEND_ITA_SSO_BASE_URL.concat(environment.BACKEND_SSO_PATCH_USER).concat(
            `/${registerUserId}`
            ),
            {
              authToken: this.cookieService.get('authToken'),
              status: 'ACTIVE'
            },
            {
              headers: {
                'Content-Type': 'application/json'
              }
            }
          )
        )
      } else {
        throw new Error('The logged-in user is not an admin.')
      }

      this.logout() // Asegúrate de llamar a la función logout
    // Asegúrate de llamar a la función logout
    } catch (error) {
      console.error('Error modifying user with admin:', error)
      throw error
    }
  }

  public getUserIdFromCookie (): string | undefined {
    const stringifiedUser = this.cookieService.get('user')
    const user = JSON.parse(stringifiedUser)
    return user.idUser
  }

  public getUserIdFromDummy (filePath: string): Observable<any> {
    return this.http.get(filePath)
  }

  /**
   * Log in with a user. Set user as current user.
   */
  public loginRequest (user: User): Observable<loginResponse> {
    return this.http.post<loginResponse>(
      environment.BACKEND_ITA_SSO_BASE_URL.concat(environment.BACKEND_SSO_LOGIN_URL),
      {
        dni: user.dni,
        password: user.password
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }

  public async login (user: User): Promise<any> {
    const resp = await firstValueFrom(this.loginRequest(user))
    if (resp === null || resp === undefined) {
      throw new Error('Empty response')
    }
    this.currentUser = new User(resp.id)
    this.cookieService.set('authToken', resp.authToken)
    this.cookieService.set('refreshToken', resp.refreshToken)
    this.cookieService.set('user', JSON.stringify(this.currentUser))
    return resp
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

  /* Check if the user is  Logged in */
  // TODO: Desarrollar una vez validados los tokens. Por ahora, se usa solo cookie.service.
  // public isUserLoggedIn (): boolean {
  //   const authToken = this.cookieService.get('authToken')
  //   if (authToken !== null && authToken !== undefined && authToken !== '') {
  //     console.log('is logged: true')
  //     return true
  //   }

  //   const refreshToken = this.cookieService.get('refreshToken')
  //   if (refreshToken !== null && refreshToken !== undefined && refreshToken !== '') {
  //     console.log('is logged: true')
  //     return true
  //   }

  //   console.log('is logged: false')
  //   return false
  // }
}
