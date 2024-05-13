import { Injectable } from "@angular/core";
import { Observable, filter } from "rxjs";
import { environment } from "../../environments/environment";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { FilterChallenge } from "../models/filter-challenge.model";
import { Challenge } from "../models/challenge.model";

@Injectable({
  providedIn: 'root'
})

export class StarterService {

  constructor(private http: HttpClient) { }

  getAllChallenges(): Observable<Object> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    })
    return this.http.get(`${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ALL_CHALLENGES_URL}`,
      {
        headers
      });
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

  getAllChallengesFiltered(filters: FilterChallenge, respArray: any[], pageOffset: number, pageLimit: number): Observable<Object> {
    return new Observable<Object>((observer) => {
      console.log('resptArray', respArray)
      console.log('filters', filters)
      const filteredChallenges: Challenge[] = respArray.filter(challenge => {
        
        // languages filter
        if (filters.languages.length > 0) {
          const challengeLanguages = challenge.languages.map((language: {id_language: string}) => language.id_language);
          if (!filters.languages.some(language => challengeLanguages.includes(language))) {
            return false; // any lenguage
          }
        }
        // filter with levels
        if (filters.levels.length > 0 && !filters.levels.includes(challenge.level.toUpperCase())) {
          return false; // any levels
        }
        // todo: filter with progress
        if (filters.progress.length > 0) {
          // if (filters.progress.every(progress => challenge.testingValues.length === 0)) {
          //   return false;
          // }
          return false;
        }
        return true;
      });

      // Paginar los desafíos filtrados
      const paginatedChallenges = filteredChallenges.slice(pageOffset, pageOffset + pageLimit);

      observer.next(paginatedChallenges);
      observer.complete();
    });
  }

}