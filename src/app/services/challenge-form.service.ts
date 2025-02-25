import { Inject, Injectable } from '@angular/core';
import { Language } from '../models/challenges.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment'
import { CreateChallenge } from '../models/create-challenge.interface';

@Injectable({
  providedIn: 'root'
})
export class ChallengeFormService {
  constructor (@Inject(HttpClient) private readonly http: HttpClient) {}




  getAllLangugesCreateForm(): Observable<{ results: Language[] }>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    })
    const url = `${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ALL_LANGUAGE_URL}`;
;

    return this.http.get<{ results: Language[] }>(url, { headers });
  }

}
