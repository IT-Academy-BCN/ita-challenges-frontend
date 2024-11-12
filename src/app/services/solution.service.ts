import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { BehaviorSubject, Subject, type Observable } from 'rxjs'
import { environment } from 'src/environments/environment'
import { type DataSolution } from '../models/data-solution.model'
import { type Result } from '../models/user-solution.interface'
import { tap } from 'rxjs/operators'
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
  updatingState: boolean = false // Nuevo flag para evitar la recursividad
  private readonly userSolutions: Result[] = []
  updateSolutionSentState (value: boolean): void {
    if (this.updatingState) return // Evita la recursividad
    this.updatingState = true
    this.solutionSentSubject.next(value)
    this.solutionSent = value
    this.updatingState = false
  }

  sendSolution (solution: string): void {
    if (!this.solutionSent) {
      console.log('Sending solution:', solution)
      this.updateSolutionSentState(true) // Cuando se haya enviado la solución, actualiza el estado
      // Lógica para enviar la solución al backend si es necesario
    }
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

  getUserSolution (userId: string, challengeId: string, languageId: string): Observable<Result> {
    return this.http.get<Result>(`${environment.USER_SOLUTION.replace('{idUser}', userId).replace('{challengeId}', challengeId).replace('{languageId}', languageId)}`,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }).pipe(
      tap((response: Result) => {
      // Aquí capturas y trabajas con la respuesta
        console.log('Respuesta recibida:', response)
      })
    )
  }

  public sendSolutionText (solution: boolean): void {
    this.submitSolutionSubject.next(solution)
  }

  fetchUserSolution (userId: string): Observable<Result> {
    return this.http.get<Result>(`${environment.USER_SOLUTION.replace('{idUser}', userId)}`,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }).pipe(
      tap((response: Result) => {
        this.userSolutions.push(response)
        console.log('Respuesta recibida:', response)
      })
    )
  }

  isSolutionSentb (challengeId: string): boolean {
    // Comprobar si el challengeId está presente en las soluciones del usuario
    return this.userSolutions.some(solution => solution.id_challenge === challengeId)
  }
}
