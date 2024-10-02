import { Inject, Injectable } from '@angular/core'
import { AuthService } from './auth.service'
import { type User } from '../models/user.model'
import { SolutionService } from './solution.service'

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // public userRegistered: boolean = false
  public userLoggedIn: boolean = false
  public userSentASolution: boolean = false

  constructor (
    @Inject(AuthService) private readonly authService: AuthService,
    @Inject(SolutionService) private readonly solutionService: SolutionService
  ) {}

  public async login (user: User): Promise<void> {
    await this.authService.login(user)
    this.userLoggedIn = true
    console.log(`userLoggedIn: ${this.userLoggedIn}`)
  }

  public logout (): void {
    this.authService.logout()
    this.userLoggedIn = false
    this.userSentASolution = false
    console.log(`userLoggedIn: ${this.userLoggedIn}`)
  }

  public monitorSolutionState (): void {
    this.solutionService.solutionSent$.subscribe((solutionSent) => {
      this.userSentASolution = solutionSent
      console.log(`userSentASolution: ${this.userSentASolution}`)
    })
  }
}
