import { Inject, Injectable } from '@angular/core'
import { type Observable } from 'rxjs'
import { type Challenges } from '../models/challenges.interface'
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class RelatedService {
  constructor (@Inject(HttpClient) private readonly http: HttpClient) {}

  getRelatedChallenges (challengeId: string): Observable<Challenges> {
    return this.http.get<Challenges>(
      `${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ALL_CHALLENGES_URL}/${challengeId}/related`,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }
}
