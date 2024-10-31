// import { Inject, Injectable } from '@angular/core'
// import { AuthService } from './auth.service'
// // import { type User } from '../models/user.model'
// import { SolutionService } from './solution.service'
// import { CookieService } from 'ngx-cookie-service'

// @Injectable({
//   providedIn: 'root'
// })
// export class UserService {
//   public userRegistered: boolean = false
//   public userLoggedIn: boolean = false
//   public userSentASolution: boolean = false

//   constructor (
//     @Inject(AuthService) private readonly authService: AuthService,
//     @Inject(CookieService) private readonly cookieService: CookieService,
//     @Inject(SolutionService) private readonly solutionService: SolutionService
//   ) {}

//   public isUserLoggedIn (): boolean {
//     const authToken = this.cookieService.get('authToken')
//     if (authToken !== null && authToken !== undefined && authToken !== '') {
//       this.userLoggedIn = true
//       console.log(`userLoggedIn: ${this.userLoggedIn}`)
//       return true
//     }

//     const refreshToken = this.cookieService.get('refreshToken')
//     if (refreshToken !== null && refreshToken !== undefined && refreshToken !== '') {
//       this.userLoggedIn = true
//       console.log(`userLoggedIn: ${this.userLoggedIn}`)
//       return true
//     }

//     console.log(`userLoggedIn: ${this.userLoggedIn}`)
//     return false
//   }

//   // public async login (user: User): Promise<void> {
//   //   await this.authService.login(user)
//   //   this.userLoggedIn = true
//   //   console.log(`userLoggedIn: ${this.userLoggedIn}`)
//   // }

//   public logout (): void {
//     this.authService.logout()
//     this.userLoggedIn = false
//     this.userSentASolution = false
//     console.log(`userLoggedIn: ${this.userLoggedIn}`)
//   }

//   public monitorSolutionState (): void {
//     this.solutionService.solutionSent$.subscribe((solutionSent) => {
//       this.userSentASolution = solutionSent
//       console.log(`userSentASolution: ${this.userSentASolution}`)
//     })
//   }
// }
import { Inject, Injectable } from '@angular/core'
import { AuthService } from './auth.service'
import { SolutionService } from './solution.service'
import { CookieService } from 'ngx-cookie-service'
import { BehaviorSubject, type Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public userRegistered: boolean = false
  public userSentASolution: boolean = false

  // BehaviorSubject per lo stato di login
  private readonly userLoggedInSubject: BehaviorSubject<boolean>
  public userLoggedIn$: Observable<boolean>

  constructor (
    @Inject(AuthService) private readonly authService: AuthService,
    @Inject(CookieService) private readonly cookieService: CookieService,
    @Inject(SolutionService) private readonly solutionService: SolutionService
  ) {
    // Inizializza lo stato di login basandoti sui cookie
    const isLoggedIn = this.checkLoginStatus()
    this.userLoggedInSubject = new BehaviorSubject<boolean>(isLoggedIn)
    this.userLoggedIn$ = this.userLoggedInSubject.asObservable()
  }

  // Metodo per controllare lo stato di login dai cookie
  private checkLoginStatus (): boolean {
    const authToken = this.cookieService.get('authToken')
    const refreshToken = this.cookieService.get('refreshToken')
    return (authToken !== null && authToken !== undefined && authToken !== '') || (refreshToken !== null && refreshToken !== undefined && refreshToken !== '')
  }

  // Metodo per aggiornare lo stato di login
  public updateLoginStatus (isLoggedIn: boolean): void {
    console.log('UserService.updateLoginStatus() called with:', isLoggedIn)
    this.userLoggedInSubject.next(isLoggedIn)
  }

  // Chiamato dopo un login riuscito
  public login (): void {
    this.updateLoginStatus(true)
  }

  // Chiamato dopo il logout
  public logout (): void {
    console.log('UserService.login() called')
    this.authService.logout()
    this.updateLoginStatus(false)
    this.userSentASolution = false
  }

  // Metodo per monitorare lo stato delle soluzioni
  public monitorSolutionState (): void {
    this.solutionService.solutionSent$.subscribe((solutionSent) => {
      this.userSentASolution = solutionSent
      console.log(`userSentASolution: ${this.userSentASolution}`)
    })
  }
}
