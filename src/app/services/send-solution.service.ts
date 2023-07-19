import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SendSolutionService {

    subject = new BehaviorSubject(1);
    obs$ = this.subject.asObservable();

  constructor(private http: HttpClient) { }

  sendSolutionToBackend(solution: string) {
    console.log("Data sent to backend: " + solution);
    // this.http.get();
  }

}
