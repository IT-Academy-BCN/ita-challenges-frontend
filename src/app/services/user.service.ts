import { Inject, Injectable } from '@angular/core'
import { SolutionService } from './solution.service'
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public userSentASolution: boolean = false

  private readonly solutionSentSubject = new BehaviorSubject<boolean>(false)
  solutionSent$ = this.solutionSentSubject.asObservable()

  private readonly userSolutionsSubject = new BehaviorSubject<string[]>([])
  userSolutions$ = this.userSolutionsSubject.asObservable()

  userSolutions: string[] = []

  constructor (
    @Inject(SolutionService) private readonly solutionService: SolutionService
  ) {
    this.solutionService.solutionSent$.subscribe((solutionSent) => {
      this.userSentASolution = solutionSent
      console.log(`userSentASolution: ${this.userSentASolution}`)
    })
  }

  // metodo para monitorear el estado de la solución
  public monitorSolutionState (): void {
    console.log('Fetching solutions...')
    this.solutionService.fetchUserSolution().subscribe((response) => {
      console.log('Response received:', response)
      const challengeIds: string[] = response.challenges.map((challenge: any) => challenge.uuid_challenge)
      this.userSolutions = challengeIds
      console.log('Updated userSolutions:', this.userSolutions)
      console.log(`userSolutions: ${JSON.stringify(this.userSolutions)}`)
      this.solutionSentSubject.next(this.userSolutions.length > 0)
      console.log('Emitted to userSolutionsSubject:', this.userSolutions.length > 0)
    })
  }

  public isSolutionSent (challengeId: string): boolean {
    // Comprobar si el challengeId está presente en las soluciones del usuario
    return this.userSolutions.includes(challengeId)
  }

  public addSolutionForChallenge (challengeId: string): void {
    const currentSolutions = this.userSolutions
    if (!currentSolutions.includes(challengeId)) {
      const updatedSolutions = [...currentSolutions, challengeId]
      this.userSolutions = updatedSolutions
      this.solutionSentSubject.next(updatedSolutions.length > 0)
    }
  }
}
