import { Inject, Injectable } from '@angular/core'
import { type Observable } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { type Itinerary } from '../models/itinerary.interface'
import { environment } from 'src/environments/environment'
import { type Challenge } from '../models/challenge.model'
// import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})

export class ChallengeService {
  constructor (@Inject(HttpClient) private readonly http: HttpClient) { }
  getChallengeById (id: string): Observable<Challenge> {
    // -----TO CHANGE----

    /*        return this.http.get(`${environment.BACKEND_BASE_URL}${environment.BACKEND_ALL_CHALLENGES}`,
                    {
                        headers: {
                            'Content-Type': 'application/dummy'
                        }
                    }); */

    return this.http.get<Challenge>('../assets/dummy/challenge.json',
      {
        headers: {
          'Content-Type': 'application/dummy'
        }
      })
  }

  async getItineraries (): Promise<Itinerary[]> {
    return await new Promise((resolve, reject) =>
      this.http.get<Itinerary[]>(environment.BACKEND_ITA_SSO_BASE_URL.concat(environment.BACKEND_SSO_ITINERARIES))
        .subscribe({
          next: (res) => { resolve(res) },
          error: (err) => { reject(err) }
        })
    )
  }
}
