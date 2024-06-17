import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { BehaviorSubject, type Observable } from 'rxjs'
import { environment } from 'src/environments/environment'
import { type DataSolution } from '../models/data-solution.model'
import { type userSolution } from '../models/user-solution.interface'

@Injectable({
  providedIn: 'root'
})
export class SolutionService {
  private readonly http = inject(HttpClient)

  activeIdSubject = new BehaviorSubject<number>(1)
  activeId$ = this.activeIdSubject.asObservable()

  private readonly solutionSentSubject = new BehaviorSubject<boolean>(false)
  solutionSent$ = this.solutionSentSubject.asObservable()

  solutionSent: boolean = false

  updateSolutionSentState (value: boolean): void {
    this.solutionSentSubject.next(value)
    this.solutionSent = value
  }

  sendSolution (solution: string): void {
    this.updateSolutionSentState(true) // Cuando se haya enviado la solución, actualiza el estado
  }

  getAllSolutions (idChallenge: string, idLanguage: string): Observable<DataSolution> {
    return this.http.get<DataSolution>(`${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ITA_CHALLENGE_SOLUTION}/${idChallenge}/language/${idLanguage}`, 
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }

  isUserSolutionSent (userId: string | undefined, challengeId: string, languageId: string): Observable<userSolution> {
    // const solutionsUser = this.http.get<userSolution>(`${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ITA_CHALLENGE_USER_SOLUTION}/user/${userId}/challenge/${challengeId}/language/${languageId}`)
    return this.http.get<userSolution>(`${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ITA_CHALLENGE_USER_SOLUTION}/user/c3a92f9d-5d10-4f76-8c0b-6d884c549b1c/challenge/7fc6a737-dc36-4e1b-87f3-120d81c548aa/language/1e047ea2-b787-49e7-acea-d79e92be3909`,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    // Peticion con datos harcodeados porque user es anonym
  }
}
