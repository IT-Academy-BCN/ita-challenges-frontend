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

  private readonly challengeCompletedSubject = new Subject<string>()
  challengeCompleted$ = this.challengeCompletedSubject.asObservable()

  updateSolutionSentState (value: boolean): void {
    this.solutionSentSubject.next(value)
  }

  sendSolution (solution: string, challengeId?: string): void {
    // Cuando se haya enviado la solución, actualiza el estado
    this.updateSolutionSentState(true)
    // Lógica para enviar la solución al backend si es necesario
  }

  completeChallenge(challengeId: string): void {
    // Remove from localStorage
    const savedChallenge = JSON.parse(localStorage.getItem('challengeStarted') ?? '{}')
    if (savedChallenge.id === challengeId) {
      localStorage.removeItem('challengeStarted')
    }
    
    // Notify subscribers
    this.challengeCompletedSubject.next(challengeId)
  }

  getAllChallengeSolutions (idChallenge: string, idLanguage: string): Observable<DataSolution> {
    return this.http.get<DataSolution>(`${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ITA_CHALLENGE_SOLUTION}/challenge/${idChallenge}/language/${idLanguage}`,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }

  submitSolution(challengeId: string, languageId: string, solutionText: string, userId: string, status: string): Observable<any> {
    const body = {
      challengeId,
      languageId,
      userId,
      solutionText,
      status,
    };
  
    return this.http.put<any>(
      `${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ITA_CHALLENGE_USER_SOLUTION}`,
      body,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }

  getUserSolution (challengeId: string, languageId: string): Observable<UserSolution> {
    return this.http.get<UserSolution>(`${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ITA_CHALLENGE_USER_SOLUTION}/challenge/${challengeId}/language/${languageId}`,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      })
  }

  public sendSolutionText (solution: boolean): void {
    this.submitSolutionSubject.next(solution)
  }

  fetchUserSolution (): Observable<any> {
    return this.http.get<any>(`${environment.USER_SOLUTION}`,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      })
  }
}
