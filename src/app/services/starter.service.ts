import { Inject, Injectable } from '@angular/core'
import { Observable, Subject, map, of, tap } from 'rxjs'
import { environment } from '../../environments/environment'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { type FilterChallenge } from '../models/filter-challenge.model'
import { type Challenge, type ChallengeResponse } from '../models/challenge.model'
import { type Tag, type TagResponse } from '../models/tag-response.interface'

@Injectable({
  providedIn: 'root'
})

export class StarterService {
  constructor (@Inject(HttpClient) private readonly http: HttpClient) {}
  cachedChallenges: ChallengeResponse | null = null
  cachedTags: TagResponse | null = null

  private readonly refreshSubject = new Subject<void>()
  readonly refresh$ = this.refreshSubject.asObservable()

  invalidateCache(): void {
    this.cachedChallenges = null
  }

  invalidateCacheAndRefresh(): void {
    this.invalidateCache()
    this.refreshSubject.next()
  }

  getAllChallenges (): Observable<ChallengeResponse> {
    if (this.cachedChallenges !== null) {
      return of(this.cachedChallenges)
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    })

    return this.http.get<any>('assets/dummy/challenges-mock.json', {
      headers
    }).pipe(
      map((data) => {
        const results = Array.isArray(data?.results) ? data.results : []
        return {
          ...data,
          results: results.map((ch: any) => ({
            ...ch,
            creation_date: ch?.creation_date ? new Date(ch.creation_date) : ch?.creation_date,
            popularity: ch?.popularity ?? 0,
            languages: Array.isArray(ch?.languages) ? ch.languages : [],
            detail: {
              ...(ch?.detail ?? {}),
              description: ch?.detail?.description ?? '',
              notes: ch?.detail?.notes ?? '',
              examples: Array.isArray(ch?.detail?.examples) ? ch.detail.examples : []
            },
            solutions: Array.isArray(ch?.solutions)
              ? ch.solutions.map((id: any) => (typeof id === 'string'
                ? ({ id_solution: id, solution_text: '' })
                : id))
              : []
          }))
        } as ChallengeResponse
      }),
      tap((response) => {
        this.cachedChallenges = response
      })
    )
  }

  getAllChallengesOffset (pageOffset: number, pageLimit: number): Observable<ChallengeResponse> {
    const params = new HttpParams().set('offset', pageOffset.toString()).set('limit', pageLimit.toString())

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    })
    return this.http.get<ChallengeResponse>(`${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ALL_CHALLENGES_URL}`, {
      headers,
      params
    })
  }

  orderBySort (sortBy: string, resp: Challenge[], offset: number, limit: number, isAscending: boolean): Observable<Challenge[]> {
    const sortedChallenges: Challenge[] = [...resp]

    sortedChallenges.sort((a: Challenge, b: Challenge) => {
      let comparison = 0

      if (sortBy === 'creation_date') {
        const dateA = new Date(a.creation_date)
        const dateB = new Date(b.creation_date)

        comparison = isAscending ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime()
      } else if (sortBy === 'popularity') {
        const scoreA = a.timesSolved ?? 0
        const scoreB = b.timesSolved ?? 0

        comparison = isAscending ? scoreA - scoreB : scoreB - scoreA
      } else if (sortBy === 'likes') {
        const scoreA = a.timesFavorite ?? 0
        const scoreB = b.timesFavorite ?? 0

        comparison = isAscending ? scoreA - scoreB : scoreB - scoreA
      } else if (sortBy === 'difficulty') {
        const levelMap: Record<string, number> = { EASY: 1, MEDIUM: 2, HARD: 3 }
        const levelA = levelMap[a.level] ?? 0
        const levelB = levelMap[b.level] ?? 0

        comparison = isAscending ? levelA - levelB : levelB - levelA
      }

      return comparison 
    })

    const paginatedChallenges = sortedChallenges.slice(offset, offset + limit)

    return new Observable<Challenge[]>(observer => {
      observer.next(paginatedChallenges)
      observer.complete()
    })
  }

  getAllChallengesFiltered (filters: FilterChallenge, respArray: Challenge[]): Observable<Challenge[]> {
  return of(respArray).pipe(
    map(challenges => {
      return challenges.filter(challenge => {
        const challengeLanguageIds = (challenge.languages ?? [])
          .map((l: any) => l.id_language)
          .filter(Boolean);

        const languageMatch =
          (filters.languages?.length ?? 0) === 0 ||
          challengeLanguageIds.some(id => filters.languages.includes(id));

        const challengeTagIds: string[] = Array.isArray((challenge as any).tags)
          ? (challenge as any).tags as string[]
          : [];

        const tagMatch =
          (filters.tags?.length ?? 0) === 0 ||
          challengeTagIds.some(id => (filters.tags as string[]).includes(id));

        const levelMatch =
          (filters.levels?.length ?? 0) === 0 ||
          filters.levels.includes(String(challenge.level).toUpperCase());

        return languageMatch && tagMatch && levelMatch;
      });
    })
  );
}

}
