import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { BehaviorSubject, Subject, type Observable } from 'rxjs'
import { environment } from 'src/environments/environment'
import { type DataSolution } from '../models/data-solution.model'
import { type UserSolution } from '../models/user-solution.interface'

@Injectable({
  providedIn: 'root'
})
export class SolutionService {
  private readonly http = inject(HttpClient)

  activeIdSubject = new BehaviorSubject<number>(1)
  activeId$ = this.activeIdSubject.asObservable()

  private readonly solutionSentSubject = new BehaviorSubject<boolean>(false)
  solutionSent$ = this.solutionSentSubject.asObservable()

  submitSolutionSubject = new Subject<boolean>()
  public sendSolutionText$ = this.submitSolutionSubject.asObservable()

  solutionSent: boolean = false

  updateSolutionSentState (value: boolean): void {
    this.solutionSentSubject.next(value)
    // this.solutionSent = value
  }

  sendSolution (solution: string): void {
    this.updateSolutionSentState(true) // Cuando se haya enviado la solución, actualiza el estado
  }

  getAllChallengeSolutions (idChallenge: string, idLanguage: string): Observable<DataSolution> {
    return this.http.get<DataSolution>(`${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ITA_CHALLENGE_SOLUTION}/${idChallenge}/language/${idLanguage}`,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }

  getUserSolution (userId: string, challengeId: string, languageId: string): Observable<UserSolution> {
    return this.http.get<UserSolution>(`${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ITA_CHALLENGE_USER_SOLUTION}/user/${userId}/challenge/${challengeId}/language/${languageId}`,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      })
  }

  public sendSolutionText (solution: boolean): void {
    this.submitSolutionSubject.next(solution)
  }
}
