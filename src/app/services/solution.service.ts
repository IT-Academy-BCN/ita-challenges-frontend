import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable, Input, inject } from '@angular/core'
import { BehaviorSubject, type Observable } from 'rxjs'
import { environment } from 'src/environments/environment'
import { DataSolution } from '../models/data-solution.model'

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

  getAllSolutions(idChallenge: string, idLanguage: string): Observable<DataSolution> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    })
    return this.http.get<DataSolution>(`${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ITA_CHALLENGE_SOLUTION}/${idChallenge}/language/${idLanguage}`,
      {
        headers
      });
  }}
