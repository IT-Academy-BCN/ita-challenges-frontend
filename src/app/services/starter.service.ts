import { Injectable } from '@angular/core'
import { type Observable } from 'rxjs'
import { environment } from '../../environments/environment'
import { type HttpClient, HttpHeaders } from '@angular/common/http'
import { type Challenge } from '../models/challenge.model'

@Injectable({
  providedIn: 'root'
})

export class StarterService {
  constructor (private readonly http: HttpClient) { }
  getAllChallenges (page: number, pageSize: number): Observable<Challenge> {
    // const params = {
    //   page: page.toString(),
    //   pageSize: pageSize.toString()
    // }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    })

    return this.http.get<Challenge>(`${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ALL_CHALLENGES_URL}`,
      {
        // params,
        headers
      })
  }
}
