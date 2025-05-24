import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { BehaviorSubject, of, Subject, type Observable } from 'rxjs'
import { environment } from 'src/environments/environment'
import { type DataSolution } from '../models/data-solution.model'
import { type UserSolution } from '../models/user-solution.interface'
import { ChallengeTab } from 'src/app/shared/enums/challenge-tab.enum'

@Injectable({
  providedIn: 'root'
})
export class SolutionService {
  private readonly http = inject(HttpClient)

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

  submitSolution(uuid_challenge: string, uuid_language: string, uuid_user: string, status: string, solution_text: string): Observable<any> {
    const body = {
      uuid_challenge,
      uuid_language,
      uuid_user,
      solution_text,
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

  fetchUserSolution (): Observable<any[]> {
    const mockSolutions = [
      {
        uuid_user: '1a2b3c4d-5e6f-6a8b-9c0d-1e2f3a4b5c6d',
        uuid_challenge: 'd43a1a4d-ee8f-432d-8f9c-68eda2547dae',
        uuid_language: '409c9fe8-74de-4db3-81a1-a55280cf92ef',
        solution_text: 'Esta es la solución del usuario para el reto FizzBuzz'
      },
      {
        uuid_user: '1a2b3c4d-5e6f-6a8b-9c0d-1e2f3a4b5c6d',
        uuid_challenge: 'b5c06903-f27b-4057-8220-ad9d957cdce4',
        uuid_language: '09fabe32-7362-4bfb-ac05-b7bf854c6e0f',
        solution_text: 'Esta es la solución del usuario para el reto Contador de vocales únicas'
      }
    ]

    return of(mockSolutions)
  }
}
