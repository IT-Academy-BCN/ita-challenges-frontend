import { language } from '@codemirror/language';
import { Injectable } from "@angular/core";
import { Observable, filter, map, of, tap } from "rxjs";
import { environment } from "../../environments/environment";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { FilterChallenge } from "../models/filter-challenge.model";
import { Challenge } from "../models/challenge.model";

@Injectable({
  providedIn: 'root'
})
export class StarterService {

  constructor(private http: HttpClient) { }

  // getAllChallenges(): Observable<Object> {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json'
  //   })
  //   return this.http.get(`${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ALL_CHALLENGES_URL}`,
  //     {
  //       headers
  //     });
  // }


  getAllChallenges(): Observable<Object> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.get(`${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ALL_CHALLENGES_URL}`, { headers })
      .pipe(
        tap(data => console.log(data))
      );
  }


  getAllChallengesOffset(pageOffset: number, pageLimit: number): Observable<Object> {
    const params = new HttpParams()
      .set('offset', pageOffset.toString())
      .set('limit', pageLimit.toString())

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    })
    return this.http.get(`${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ALL_CHALLENGES_URL}`,
      {
        headers,
        params
      });
  }

  orderBySortAscending(sortBy: string, resp: any[], offset: number, limit: number): Observable<Object> {
    let sortedChallenges = [...resp]
    sortedChallenges = resp.sort((a: any, b: any) => {
      const dateA = new Date(a.creation_date);
      const dateB = new Date(b.creation_date);
      return dateB.getTime() - dateA.getTime();
    });

    const paginatedChallenges = sortedChallenges.slice(offset, offset + limit);

    return new Observable<any>((observer) => {
      observer.next(paginatedChallenges);
      observer.complete();
    });
  }

  orderBySortAsDescending(sortBy: string, resp: any[], offset: number, limit: number): Observable<Object> {
    let sortedChallenges = [...resp]
    //Todo: falta condicional para sortby "popularity"

    sortedChallenges = resp.sort((a: any, b: any) => {
      const dateA = new Date(a.creation_date);
      const dateB = new Date(b.creation_date);
      return dateA.getTime() - dateB.getTime();
    });

    const paginatedChallenges = sortedChallenges.slice(offset, offset + limit);

    return new Observable<any>((observer) => {
      observer.next(paginatedChallenges);
      observer.complete();
    });
  }

  getAllChallengesFiltered(filters: FilterChallenge, respArray: Challenge[]): Observable<any[]> {
    return of(respArray).pipe(
      map(challenges => {
        return challenges.filter(challenge => {
          const languageMatch = filters.languages.length === 0 ||
            challenge.languages.every(lang => filters.languages.includes(lang.id_language));
            
          const levelMatch = filters.levels.length === 0 ||
            filters.levels.includes(challenge.level.toUpperCase());

          //todo: need to implement progress filter
          return languageMatch && levelMatch; // Usar '&&' en lugar de '||' para que ambos criterios se cumplan
        })
      }),
    );
  }
}