import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { BehaviorSubject, catchError, map, of, Subject, type Observable } from 'rxjs'
import { environment } from 'src/environments/environment'
import { type DataSolution } from '../models/data-solution.model'
import { SubmitSolutionResponse, type UserSolution } from '../models/user-solution.interface'
import { ChallengeTab } from 'src/app/shared/enums/challenge-tab.enum'
import { switchMap } from 'rxjs'
import { AuthService } from 'src/app/services/auth.service'


@Injectable({
  providedIn: 'root'
})
export class SolutionService {
  private readonly http = inject(HttpClient)
  private readonly authService = inject(AuthService)

  activeIdSubject = new BehaviorSubject<ChallengeTab>(ChallengeTab.DETAILS)
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

  private solutionTextSubject = new BehaviorSubject<string>('');
  solutionText$ = this.solutionTextSubject.asObservable();

  solutionText(text: string): void {
    this.solutionTextSubject.next(text);
  }

  submitSolution(uuid_challenge: string, uuid_language: string, uuid_user: string, action: string, solution_text: string): Observable<any> {
    const body = {
      uuid_challenge,
      uuid_language,
      uuid_user,
      solution_text,
      action,
    };

    return this.http.put<any>(
      `${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ITA_CHALLENGE_USER_SOLUTION}`,
     body,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    ).pipe(
      map((response: SubmitSolutionResponse) => {
        return {
          ...response,
          isSolved: true,
          timesSolved: response.timesSolved ?? 1
        }
      })
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

  fetchUserSolution (): Observable<UserSolution[]> {
    return this.authService.getUserId().pipe(
      switchMap(userId => {
        if (typeof userId !== 'string' || userId.trim() === '') {
          console.warn('User ID not available, skipping request')
          return of([])
        }
        const url = `${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.USER_SOLUTION}${userId}/solutions`
        return this.http.get<UserSolution[]>(url).pipe(
          catchError(error => {
            console.error('Error fetching user solution:', error)
            return of([])
          }))
      })
    )
  }
}
