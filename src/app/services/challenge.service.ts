/* eslint-disable padded-blocks */
/* eslint-disable @typescript-eslint/semi */
import { Inject, Injectable, inject, signal } from '@angular/core'
import { Observable, catchError, BehaviorSubject, of, throwError, forkJoin, switchMap } from 'rxjs'
import { delay, map, tap } from 'rxjs/operators'
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http'
import { type Itinerary } from '../models/itinerary.interface'
import { environment } from 'src/environments/environment'
import { type Challenge } from '../models/challenge.model'
import { type Language } from '../models/language.model'
import { type FavoriteResponse } from '../models/favorite-response.interface'
import { type Tag, type TagResponse } from '../models/tag-response.interface'
import { type CreateChallenge } from '../models/create-challenge.interface'
import { ChallengeFormService } from './challenge-form.service'
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
  private readonly challengeFormService = inject(ChallengeFormService)

  public readonly tagMap = signal<Record<string, Tag>>({})

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
    // TODO: REMOVE — dev mock (no backend available)
    if (!environment.production) {
      return of({
        id_challenge: id,
        challenge_title: { en: 'Mock Challenge Title', es: 'Título de Desafío Mock', ca: 'Títol de Desafiament Mock' },
        level: 'MEDIUM',
        creation_date: new Date(),
        popularity: 42,
        favorites_count: 5,
        saved_count: 3,
        timesFavorite: 5,
        timesSolved: 10,
        bookmarked: false,
        detail: {
          description: { en: 'This is a mock description for testing the edit form.', es: 'Esta es una descripción mock para probar el formulario de edición.', ca: 'Aquesta és una descripció mock per provar el formulari d\'edició.' },
          examples: [],
          notes: 'Some mock notes'
        },
        tags: ['tag-1', 'tag-2'],
        languages: [{ id_language: 'lang-js', language_name: 'Javascript' }],
        solutions: []
      } as any)
    }
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
    const headers = {
      'Content-Type': 'application/json',
      ...this.authService.getAuthHeaders()
    };
    return this.http.post(url, challenge, { headers });
  }

  addToFavorites (challengeId: string): Observable<FavoriteResponse> {
    const headers = {
      'Content-Type': 'application/json',
      ...this.authService.getAuthHeaders()
    };
    const url = `${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ITA_FAVORITES}/${challengeId}`;
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
    const url = `${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ITA_FAVORITES}/${challengeId}`;
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
    const url = `${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_USERINTERACTION_FAVORITES}/${userId}`;
    return this.http.get<string[]>(url, { headers });
  }

  getUserBookmarks (userId: string): Observable<string[]> {
    const headers = {
      'Content-Type': 'application/json',
      ...this.authService.getAuthHeaders()
    }
    const url = `${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_USER_BOOKMARKS_PATH}/${userId}/bookmarks`;
    return this.http.get<string[]>(url, { headers })
  }

  addBookmark (challengeId: string): Observable<any> {
    const headers = {
      'Content-Type': 'application/json',
      ...this.authService.getAuthHeaders()
    };
    const url = `${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ALL_CHALLENGES_URL}/${challengeId}/bookmarks`;
    return this.http.post<any>(
      url,
      {},
      { headers }
    ).pipe(
      map(response => response),
      catchError(error => {
        console.error('Error adding bookmark:', error);
        return throwError(() => error);
      })
    );
  }

  removeBookmark (challengeId: string): Observable<any> {
    const headers = {
      'Content-Type': 'application/json',
      ...this.authService.getAuthHeaders()
    };
    const url = `${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ALL_CHALLENGES_URL}/${challengeId}/bookmarks`;
    return this.http.delete<any>(
      url,
      { headers }
    ).pipe(
      map(response => response),
      catchError(error => {
        console.error('Error removing bookmark:', error);
        return throwError(() => error);
      })
    );
  }

  // Helper methods for mock implementation
  private getMockFavoriteCount(challengeId: string): number {
    const key = `favorites_count_${challengeId}`
    const storedCount = localStorage.getItem(key)
    return storedCount ? parseInt(storedCount, 10) : 0
  }


  getRelatedChallenges(challengeId: string): Observable<Challenge[]> {
    const headers = {
      'Content-Type': 'application/json',
      ...this.authService.getAuthHeaders()
    };

    const url = `${environment.BACKEND_ITA_CHALLENGE_BASE_URL}/challenge/challenges/${challengeId}/related`;

    return this.http.get<{results: Challenge[] }>(url, { headers }).pipe(
      map(response => response.results),
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching related challenges:', error);
        return throwError(() => error);
      })
    );
  }

  editChallenge(challengeId: string, challenge: Partial<Challenge>): Observable<Challenge> {
    const url = `${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_EDIT_CHALLENGE_URL}/${challengeId}/update`;

    const headers = {
      'Content-Type': 'application/json',
      ...this.authService.getAuthHeaders() 
    };

    return this.http.put<Challenge>(url, challenge, { headers });
  }

  getChallengeTags(challengeId: string): Observable<TagResponse> {
    const url = `${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ITA_CHALLENGE_TAGS}/${challengeId}`
    
     const headers = {
      'Content-Type': 'application/json',
    };

    return this.http.get<TagResponse>(url, { headers })
  }


  fetchAndCacheAllTags (): Observable<void> {
    if (Object.keys(this.tagMap()).length > 0) return of(undefined)

    return this.challengeFormService.getAllLangugesCreateForm ().pipe(
      map(response => response.results),
      catchError(error => {
        console.error('Error fetching languages for tags cache:', error)
        return of([])
      }),
      switchMap(languages => {
        if (languages.length === 0) return of([])

        const tagRequests = languages.map(lang =>
          this.challengeFormService.getTagsByLanguage(lang.id_language).pipe(
            map(res => res.results),
            catchError( () => of([]))
          )
        )
        return forkJoin(tagRequests)
      }),
      tap(allTagsResults => {
        if (allTagsResults.length === 0) return

        const dictionary: Record<string, Tag> = {}
        allTagsResults.forEach(tags => {
          tags.forEach(tag => {
            dictionary[tag.id_tag] = tag
          })
        })
        this.tagMap.set(dictionary)
      }),
      map(() => undefined)
    )
  }

}
