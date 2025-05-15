/* eslint-disable padded-blocks */
/* eslint-disable @typescript-eslint/semi */
import { Inject, Injectable, inject } from '@angular/core'
import { Observable, catchError, BehaviorSubject, of, throwError } from 'rxjs'
import { delay, map } from 'rxjs/operators'
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http'
import { type Itinerary } from '../models/itinerary.interface'
import { environment } from 'src/environments/environment'
import { type Challenge } from '../models/challenge.model'
import { type Language } from '../models/language.model'
import { type FavoriteResponse } from '../models/favorite-response.interface'
import { type CreateChallenge } from '../models/create-challenge.interface'
import { CookieService } from 'ngx-cookie-service'
import { AuthService } from './auth.service'

@Injectable({
  providedIn: 'root'
})
export class ChallengeService {
  private challengeStarted: boolean = false
  private readonly challengeStartedSubject = new BehaviorSubject<boolean>(this.getChallengeStartedFromStorage())
  private readonly cookieService = inject(CookieService)
  private readonly authService = inject(AuthService)

  constructor (@Inject(HttpClient) private readonly http: HttpClient) {
    this.checkChallengeStartedFromStorage()
  }

  get challengeStarted$ (): Observable<boolean> {
    return this.challengeStartedSubject.asObservable()
  }

  onStartChallenge (): void {
    this.challengeStartedSubject.next(true)
    localStorage.setItem('challengeStarted', 'true')
  }

  openSendSolutionModal (): void {
    this.challengeStartedSubject.next(false)
    localStorage.setItem('challengeStarted', 'false')
  }

  private getChallengeStartedFromStorage (): boolean {
    return localStorage.getItem('challengeStarted') === 'true'
  }

  checkChallengeStartedFromStorage (): void {
    const storedState = localStorage.getItem('challengeStarted')
    if (storedState !== null && storedState !== '') {
      this.challengeStarted = JSON.parse(storedState)
    }
  }

  getChallengeById (id: string): Observable<Challenge> {
    return this.http.get<Challenge>(
      `${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ALL_CHALLENGES_URL}/${id}`,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }

  async getItineraries (): Promise<Itinerary[]> {
    return await new Promise((resolve, reject) =>
      this.http
        .get<Itinerary[]>(
        environment.BACKEND_ITA_SSO_BASE_URL.concat(
          environment.BACKEND_SSO_ITINERARIES
        )
      )
        .subscribe({
          next: (res) => {
            resolve(res)
          },
          error: (err) => {
            reject(err)
          }
        })
    )
  }

  getAllLanguages (): Observable<Language> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    })
    return this.http.get<Language>(`${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ALL_LANGUAGE_URL}`,
      {
        headers
      })
  }


  createChallenge (challenge: CreateChallenge): Observable<any> {
    const url = `${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ALL_CHALLENGES_URL}`
    return this.http.post(url, challenge, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  addToFavorites (challengeId: string): Observable<FavoriteResponse> {
    const headers = {
      'Content-Type': 'application/json',
      ...this.authService.getAuthHeaders()
    };
    const url = `${environment.BACKEND_ITA_CHALLENGE_BASE_URL}/challenge/challenges/${challengeId}/favorites`;
    return this.http.post<FavoriteResponse>(
      url,
      {},
      { headers }
    ).pipe(
      map(response => {
        return response;
      }),
      catchError(error => {
        console.error('Error adding to favorites:', error);
        return of({ favorite: false, timesFavorited: 0 });
      })
    );
  }

  removeFromFavorites (challengeId: string): Observable<FavoriteResponse> {
    const headers = {
      'Content-Type': 'application/json',
      ...this.authService.getAuthHeaders()
    };
    const url = `${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ALL_CHALLENGES_URL}/${challengeId}/favorites`;
    return this.http.delete<FavoriteResponse>(url, { headers }).pipe(
      map(response => {
        return response;
      }),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  getUserFavorites (userId: string): Observable<string[]> {
    const headers = {
      'Content-Type': 'application/json',
      ...this.authService.getAuthHeaders()
    };
    const url = `${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_USER_FAVORITES}/${userId}/favorites`;
    return this.http.get<string[]>(url, { headers });
  }

  // Helper methods for mock implementation
  private getMockFavoriteCount(challengeId: string): number {
    const key = `favorites_count_${challengeId}`
    const storedCount = localStorage.getItem(key)
    return storedCount ? parseInt(storedCount, 10) : 0
  }

}
