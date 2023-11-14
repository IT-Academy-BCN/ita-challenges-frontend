import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SolutionService {

    // subject = new BehaviorSubject(1);
    // obs$ = this.subject.asObservable();

    private solutionSentSubject = new BehaviorSubject<boolean>(false);
    solutionSent$ = this.solutionSentSubject.asObservable();

    solutionSent: boolean = false;

  constructor(private http: HttpClient) { }

  updateSolutionSentState(value: boolean) {
    this.solutionSentSubject.next(value);
    this.solutionSent = value;
  }

  sendSolution(solution: string) {
    console.log("Data sent to backend: " + solution);
    // this.http.get();
    this.updateSolutionSentState(true); // Cuando se haya enviado la solución, actualiza el estado
  }

}
