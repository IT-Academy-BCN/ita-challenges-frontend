import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Itinerary } from "../models/itinerary.interface";
import { environment } from "src/environments/environment";
//import {environment} from "../../environments/environment";


@Injectable({
  providedIn: 'root'
})

export class ChallengeService {


    constructor(private http: HttpClient) { }

    getChallengeById(id: string): Observable<Object> {

        //-----TO CHANGE----

    /*        return this.http.get(`${environment.BACKEND_BASE_URL}${environment.BACKEND_ALL_CHALLENGES}`,
                    {
                        headers: {
                            'Content-Type': 'application/dummy'
                        }
                    }); */

        return this.http.get('../assets/dummy/challenge.json',
            {
                headers: {
                    'Content-Type': 'application/dummy'
                }
            });
    }


    getItineraries(): Promise<Itinerary[]> {
        return new Promise((resolve, reject) =>
            this.http.get<Itinerary[]>(environment.BACKEND_ITA_SSO_BASE_URL.concat(environment.BACKEND_SSO_ITINERARIES))
                .subscribe({
                    next: (res) => resolve(res),
                    error: (err) => reject([])
                })
        )
    }
}
