import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})

export class StarterService {

  constructor(private http: HttpClient) { }

  getAllChallenges(page: number, pageSize: number): Observable<Object> {

    const params = {
      page: page.toString(),
      pageSize: pageSize.toString()
    };

    const headers = new HttpHeaders({
      'Content-Type' : 'application/json'
    })

    return this.http.get(`${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ALL_CHALLENGES_URL}`,
        {
          //params,
          headers
        });

  }

}