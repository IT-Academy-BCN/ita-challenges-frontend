import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})

export class StarterService {

  constructor(private http: HttpClient) { }

  getAllChallenges(pageOffset: number, pageLimit: number): Observable<Object> {
    const params = new HttpParams()
    .set('offset', pageOffset.toString())
    .set('limit', pageLimit.toString());

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    })
    return this.http.get(`${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ALL_CHALLENGES_URL}`,
      {
        headers,
        params
      });
  }

  orderBySortAscending(pageOffset:number, pageLimit: number, sortBy: string): Observable<Object> {
    console.log('ascending', sortBy)
    const params = new HttpParams()
    .set('offset', pageOffset.toString())
    .set('limit', pageLimit.toString())
    .set('sort', sortBy + ':asc')
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    })
    return this.http.get(`${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ALL_CHALLENGES_URL}`,
      {
        headers,
        params
      });
  }

  orderBySortAsDescending(pageOffset:number, pageLimit: number, sortBy: string): Observable<Object> {
    console.log('descending:', sortBy)
    const params = new HttpParams()
    .set('offset', pageOffset.toString())
    .set('limit', pageLimit.toString())
    .set('sort', sortBy + ':desc')
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    })
    return this.http.get(`${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ALL_CHALLENGES_URL}`,
      {
        headers,
        params
      });
  }

}