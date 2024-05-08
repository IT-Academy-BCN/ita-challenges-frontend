import { Injectable } from '@angular/core'
import { type Observable } from 'rxjs'
import { type Challenges } from '../models/challenges.interface'
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class RelatedService {
  constructor (private readonly http: HttpClient) {}

  getRelatedChallenges (challengeId: string): Observable<Challenges> {
    return this.http.get<Challenges>(
      `/itachallenge/api/v1/challenge/challenges/${challengeId}/related`,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }
}
