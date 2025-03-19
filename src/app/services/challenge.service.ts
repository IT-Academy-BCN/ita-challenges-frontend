import { Inject, Injectable, inject } from '@angular/core'
import { Observable, catchError, BehaviorSubject, of } from 'rxjs'
import { delay } from 'rxjs/operators'
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http'
import { type Itinerary } from '../models/itinerary.interface'
import { environment } from 'src/environments/environment'
import { type Challenge } from '../models/challenge.model'
import { type Language } from '../models/language.model'
import { type FavoriteResponse } from '../models/favorite-response.interface'
import { type CreateChallenge } from '../models/create-challenge.interface'
import { CookieService } from 'ngx-cookie-service'

@Injectable({
  providedIn: 'root'
})
export class ChallengeService {
  private challengeStarted: boolean = false
  private readonly challengeStartedSubject = new BehaviorSubject<boolean>(this.getChallengeStartedFromStorage())
  private readonly cookieService = inject(CookieService)

  constructor (@Inject(HttpClient) private readonly http: HttpClient) {
    this.checkChallengeStartedFromStorage()
  }

//  Commented, waiting for favorites endpoint
  // private getAuthHeaders(): HttpHeaders {
  //   return new HttpHeaders({
  //     'Content-Type': 'application/json'
  //   })
  // }

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

  // Método para verificar si el reto ha sido iniciado desde el almacenamiento local
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
    console.log('URL completa:', url) // Para depurar
    return this.http.post(url, challenge)
  }


  // Real implementation - commented out for testing
  // addToFavorites(challengeId: string): Observable<FavoriteResponse> {
  //   const url = `${environment.BACKEND_ITA_CHALLENGE_BASE_URL}/challenge/challenges/${challengeId}/favorites`
  //   console.log('Adding favorite, URL:', url, 'challengeId:', challengeId)
  //   return this.http.post<FavoriteResponse>(url, {}, { headers: this.getAuthHeaders() })
  //     .pipe(
  //       catchError((error: HttpErrorResponse) => {
  //         console.error('Error adding favorite:', error);
  //         throw error;
  //       })
  //     );
  // }

  // Mocked version for frontend testing
  addToFavorites(challengeId: string): Observable<FavoriteResponse> {
  
    const currentCount = this.getMockFavoriteCount(challengeId);
    
    // Create a mock response
    const mockResponse: FavoriteResponse = {
      isFavorite: true,
      timesFavorited: currentCount + 1
    }
    
    
    localStorage.setItem(`is_favorite_${challengeId}`, 'true');
   
    localStorage.setItem(`favorites_count_${challengeId}`, mockResponse.timesFavorited.toString());
    
    return of(mockResponse).pipe(delay(300));
  }

  // Real implementation - commented out for testing
  // removeFromFavorites(challengeId: string): Observable<FavoriteResponse> {
  //   const url = `${environment.BACKEND_ITA_CHALLENGE_BASE_URL}/challenge/challenges/${challengeId}/favorites`
  //   console.log('Removing favorite, URL:', url)
  //   return this.http.delete<FavoriteResponse>(url, { headers: this.getAuthHeaders() })
  //     .pipe(
  //       catchError((error: HttpErrorResponse) => {
  //         console.error('Error removing favorite:', error);
  //         throw error;
  //       })
  //     );
  // }

  // Mocked version for frontend testing
  removeFromFavorites(challengeId: string): Observable<FavoriteResponse> {

    const currentCount = this.getMockFavoriteCount(challengeId);
    
    // Create a mock response
    const mockResponse: FavoriteResponse = {
      isFavorite: false,
      timesFavorited: currentCount > 0 ? currentCount - 1 : 0
    }
    
    localStorage.setItem(`is_favorite_${challengeId}`, 'false');
    localStorage.setItem(`favorites_count_${challengeId}`, mockResponse.timesFavorited.toString());
    
    return of(mockResponse).pipe(delay(300));
  }

  // Helper methods for mock implementation
  private getMockFavoriteCount(challengeId: string): number {
    const key = `favorites_count_${challengeId}`
    const storedCount = localStorage.getItem(key)
    return storedCount ? parseInt(storedCount, 10) : 0
  }

}
