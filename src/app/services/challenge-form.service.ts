import { Inject, Injectable } from '@angular/core';
import { Language } from '../models/challenges.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ChallengeFormService {
  constructor (@Inject(HttpClient) private readonly http: HttpClient) {}

  
  getAllLangugesCreateForm(): Observable<Language[]>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    })
    const url = `${environment.BACKEND_ITA_CHALLENGE_BASE_URL}/itachallenge/api/v1/challenge/language`;
    return this.http.get<Language[]>(url, {headers})
  }

}
