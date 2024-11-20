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
  public userLoggedIn: boolean = false
  public userSentASolution: boolean = false
  // BehaviorSubject para estado de login
  private readonly userLoggedInSubject = new BehaviorSubject<boolean>(false)
  public userLoggedIn$ = this.userLoggedInSubject.asObservable()

  private readonly solutionSentSubject = new BehaviorSubject<boolean>(false)
  solutionSent$ = this.solutionSentSubject.asObservable()

  private readonly userSolutionsSubject = new BehaviorSubject<string[]>([])
  userSolutions$ = this.userSolutionsSubject.asObservable()

  userSolutions: string[] = []

  

  constructor (
    @Inject(AuthService) private readonly authService: AuthService,
    @Inject(CookieService) private readonly cookieService: CookieService,
    @Inject(SolutionService) private readonly solutionService: SolutionService
  ) {
    if (this.isUserLoggedIn()) {
      this.monitorSolutionState()
    }
    this.solutionService.solutionSent$.subscribe((solutionSent) => {
      this.userSentASolution = solutionSent
      console.log(`userSentASolution: ${this.userSentASolution}`)
    })
  }

  public isUserLoggedIn (): boolean {
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
    if (this.userLoggedIn) {
      const idUser = this.authService.currentUser.idUser
      console.log(`Fetching solutions for user ID: ${idUser}`)
      this.solutionService.fetchUserSolution(idUser).subscribe((response) => {
        console.log('Response received:', response)
        const challengeIds: string[] = response.challenges.map((challenge: any) => challenge.uuid_challenge)
        // this.userSolutions.push(...challengeIds)
        this.userSolutions = challengeIds
        console.log('Updated userSolutions:', this.userSolutions)
        // console.log(`userSolutions: ${JSON.stringify(this.userSolutions)}`)
        this.userSolutionsSubject.next(challengeIds)
        console.log('Emitted to userSolutionsSubject:', challengeIds)
      })
    } else {
      console.log('User is not logged in, skipping monitorSolutionState')
    }
  }

  isSolutionSent (challengeId: string): boolean {
    // Comprobar si el challengeId está presente en las soluciones del usuario
    return this.userSolutionsSubject.getValue().includes(challengeId)
  }

  public addSolutionForChallenge (challengeId: string): void {
    const currentSolutions = this.userSolutionsSubject.getValue()
    if (!currentSolutions.includes(challengeId)) {
      const updatedSolutions = [...currentSolutions, challengeId]
      this.userSolutionsSubject.next(updatedSolutions)
    }
  }
}
