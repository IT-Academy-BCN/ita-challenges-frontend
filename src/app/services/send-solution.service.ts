import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SendSolutionService {

    subjectSendSolution = new BehaviorSubject(1);
    obs$ = this.subjectSendSolution.asObservable();

  constructor(private http: HttpClient) { }

  sendSolutionToBackend(solution: string): Observable<any> {
    console.log("Data sent to backend: " + solution);
    return this.http.post(`${environment.BACKEND_BASE_URL}${environment.BACKEND_SEND_SOLUTION}`, solution);
  }

}
