import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { BehaviorSubject, Subject, type Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class SolutionService {
  private readonly http = inject(HttpClient)

  private readonly solutionSentSubject = new BehaviorSubject<boolean>(false)
  solutionSent$ = this.solutionSentSubject.asObservable()

  submitSolutionSubject = new Subject<boolean>()
  public sendSolutionText$ = this.submitSolutionSubject.asObservable()

  solutionSent: boolean = false

  updateSolutionSentState (value: boolean): void {
    this.solutionSentSubject.next(value)
    this.solutionSent = value
  }

  sendSolution (solution: string): void {
    this.updateSolutionSentState(true) // Cuando se haya enviado la solución, actualiza el estado
  }

  public getSolutions (filePath: string): Observable<any> {
    return this.http.get(filePath)
  }

  public sendSolutionText (solution: boolean): void {
    this.submitSolutionSubject.next(solution)
  }
}
