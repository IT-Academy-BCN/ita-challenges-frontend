import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Challenge } from '../models/challenge.model';

@Injectable({
  providedIn: 'root'
})
export class RelatedService {

  constructor(private http: HttpClient) { }

  getRelatedChallenges(challengeId: string): Observable<Challenge> {
  
    console.log("related.service, id: " + challengeId);

    return this.http.get<Challenge>(`/itachallenge/api/v1/challenge/challenges/${challengeId}/related`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
