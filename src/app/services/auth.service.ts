import { Injectable, inject } from '@angular/core'
import { environment } from '../../environments/environment'
import {
  BehaviorSubject,
  type Observable,
  firstValueFrom
} from 'rxjs'
import { User } from '../models/user.model'
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router'
import { CookieService } from 'ngx-cookie-service'
import { TokenService } from './token.service'

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

@Injectable()
export class AuthService {
  private readonly http = inject(HttpClient)
  private readonly router = inject(Router)
  private readonly cookieService = inject(CookieService)
  private readonly tokenService = inject(TokenService)

  private readonly anonym: string = 'anonym'
  private readonly userSubject: BehaviorSubject<User>
  public user$: Observable<User>

  constructor () {
    // Verificar si la cookie 'user' está definida
    const userCookie = this.cookieService.get('user')
    // const initialUser = userCookie ? JSON.parse(userCookie) : null
    const initialUser = userCookie !== null ? JSON.parse(userCookie) : null

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
    return this.http.post((environment.BACKEND_ITA_SSO_BASE_URL.concat(environment.BACKEND_SSO_REGISTER_URL)),
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
      })
  }

  public async register (user: User): Promise<any> {
    const resp: registerResponse = await firstValueFrom(this.registerRequest(user))
    await this.modifyUserWithAdmin(resp.id)
    return null
  }

  // public async register (user: User): Promise<any> {
  //   return await new Promise((resolve, reject) => {
  //     this.registerRequest(user).subscribe({
  //       next: async (resp: registerResponse) => {
  //         resolve(null)
  //         await this.modifyUserWithAdmin(resp.id)
  //       },
  //       error: (err) => { reject(err.message) }
  //     })
  //   })
  // }

  public async modifyUserWithAdmin (registerUserId: string): Promise<void> {
    const userAdmin = await firstValueFrom(this.http.get<User>(environment.ADMIN_USER))

    if (userAdmin !== null) {
      await this.login(userAdmin)
    } else {
      console.error('Admin account not found')
    }

    try {
      const userLoggedData = await this.getLoggedUserData()
      if (userLoggedData.role === 'ADMIN') {
        await firstValueFrom(
          this.http.patch((environment.BACKEND_ITA_SSO_BASE_URL.concat(environment.BACKEND_SSO_PATCH_USER).concat(`/${registerUserId}`)),
            {
              authToken: this.cookieService.get('authToken'),
              status: 'ACTIVE'
            },
            {
              headers: {
                'Content-Type': 'application/json'
              }
            })
        )
      } else {
        throw new Error('The logged-in user is not an admin.')
      }
      await this.logout()
    } catch (error) {
      console.error('Error modifying user with admin:', error)
      throw error
    }
  }

  public getUserIdFromCookie (): void {
    const stringifiedUSer = this.cookieService.get('user')
    const user = JSON.parse(stringifiedUSer)
    return user.idUser
  }

  /**
  * Log in with a user. Set user as current user.
  */
  public loginRequest (user: User): Observable<loginResponse> {
    return this.http.post<loginResponse>(environment.BACKEND_ITA_SSO_BASE_URL.concat(environment.BACKEND_SSO_LOGIN_URL),
      {
        dni: user.dni,
        password: user.password
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      })
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

  public async logout (): Promise<void> {
    this.cookieService.delete('authToken')
    this.cookieService.delete('refreshToken')
    this.cookieService.delete('user')
    await this.router.navigate(['/login'])
  }

  /**
  * get User Data
  * and store it in the cookie
  */
  public async getLoggedUserData (): Promise<UserResponse> {
    return await new Promise<UserResponse>((resolve, reject) => {
      this.http.post<UserResponse>(environment.BACKEND_ITA_SSO_BASE_URL.concat(environment.BACKEND_SSO_POST_USER),
        {
          authToken: this.cookieService.get('authToken')
        }
      ).subscribe({
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
        error: err => { reject(err.message) }
      })
    })
  }

  /* Check if the user is  Logged in */
  public async isUserLoggedIn (): Promise<void> { // TODO: neec tokenService first
    // let isUserLoggedIn: boolean = false;
    // let authToken = this.cookieService.get('authToken');
    // let authTokenValid = await this.checkToken(authToken);
    // if (authTokenValid) {
    // isUserLoggedIn = true;
    // } else {
    // let refreshToken = this.cookieService.get('authToken');
    // isUserLoggedIn = await this.checkToken(refreshToken);
    // }
    // return isUserLoggedIn;
  }

  /* return if token valid */
  async checkToken (token: string): Promise<boolean> {
    return true
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
}
