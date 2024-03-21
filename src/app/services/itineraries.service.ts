import { type HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from 'src/environments/environment'
import { type Itinerary } from '../models/itinerary.interface'

@Injectable({
  providedIn: 'root'
})
export class ItinerariesService {
  constructor (private readonly http: HttpClient) {}

  async getItineraries (): Promise<Itinerary[]> {
    return await new Promise((resolve, reject) =>
      this.http.get<Itinerary[]>(environment.BACKEND_ITA_SSO_BASE_URL.concat(environment.BACKEND_SSO_ITINERARIES))
        .subscribe({
          next: (res) => { resolve(res) },
          error: (err) => { reject([]) }
        })
    )
  }
}
