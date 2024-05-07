import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})

export class StarterService {

  constructor(private http: HttpClient) { }

  getAllChallenges(pageOffset: number, pageLimit: number): Observable<Object> {
    const headers = new HttpHeaders({
      'Content-Type' : 'application/json'
    })
    return this.http.get(`${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ALL_CHALLENGES_URL}?offset=${pageOffset}&limit=${pageLimit}`,
        {
          headers
        });
  }

}