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
  public userLoggedIn$: Observable<boolean>

  // BehaviorSubject para estado de login
  private readonly userLoggedInSubject: BehaviorSubject<boolean>

  constructor (
    @Inject(AuthService) private readonly authService: AuthService,
    @Inject(CookieService) private readonly cookieService: CookieService,
    @Inject(SolutionService) private readonly solutionService: SolutionService
  ) {
    // Inicializa el BehaviorSubject con el estado de login
    const isLoggedIn = this.checkLoginStatus()
    this.userLoggedInSubject = new BehaviorSubject<boolean>(isLoggedIn)
    this.userLoggedIn$ = this.userLoggedInSubject.asObservable()
  }

  // metodo para verificar el estado de login
  private checkLoginStatus (): boolean {
    const authToken = this.cookieService.get('authToken')
    const refreshToken = this.cookieService.get('refreshToken')
    return (authToken !== null && authToken !== undefined && authToken !== '') || (refreshToken !== null && refreshToken !== undefined && refreshToken !== '')
  }

  // metodo para actualizar el estado de login
  public updateLoginStatus (isLoggedIn: boolean): void {
    console.log('UserService.updateLoginStatus() called with:', isLoggedIn)
    this.userLoggedInSubject.next(isLoggedIn)
  }

  // llamado después del login
  public login (): void {
    this.updateLoginStatus(true)
  }

  // llamado después del logout
  public logout (): void {
    console.log('UserService.login() called')
    this.authService.logout()
    this.updateLoginStatus(false)
    this.userSentASolution = false
  }

  // metodo para monitorear el estado de la solución
  public monitorSolutionState (): void {
    this.solutionService.solutionSent$.subscribe((solutionSent) => {
      this.userSentASolution = solutionSent
      console.log(`userSentASolution: ${this.userSentASolution}`)
    })
  }
}
