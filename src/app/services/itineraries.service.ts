import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Itinerary } from '../models/itinerary.interface';

@Injectable({
  providedIn: 'root'
})
export class ItinerariesService {
    
  constructor(private http: HttpClient) {}

  getItineraries(): Promise<Itinerary[]>{
    return new Promise((resolve, reject) =>
      this.http.get<Itinerary[]>(environment.BACKEND_ITA_SSO_BASE_URL.concat(environment.BACKEND_SSO_ITINERARIES))
      .subscribe({
        next: (res) => resolve( res ),
        error: (err) => reject([])

      })
      )
  }
}
  
