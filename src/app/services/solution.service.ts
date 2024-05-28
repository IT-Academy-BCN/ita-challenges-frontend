import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { BehaviorSubject, type Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class SolutionService {
  private readonly http = inject(HttpClient)
  // subject = new BehaviorSubject(1);
  // obs$ = this.subject.asObservable();

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

  public getSolutions (filePath: string): Observable<any> {
    return this.http.get(filePath)
  }

  // public sendActiveIdAfterSolutionIsSent (activeId: number): void {
  //   this.activeIdSubject.next(activeId)
  // }
}
