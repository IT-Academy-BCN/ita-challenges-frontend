import { Inject, Injectable } from '@angular/core'
import { Observable, map, of, tap } from 'rxjs'
import { environment } from '../../environments/environment'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { type FilterChallenge } from '../models/filter-challenge.model'
import { type Challenge, type ChallengeResponse } from '../models/challenge.model'
@Injectable({
  providedIn: 'root'
})
export class StarterService {
  constructor (@Inject(HttpClient) private readonly http: HttpClient) {}
  cachedChallenges: ChallengeResponse | null = null
  getAllChallenges (): Observable<ChallengeResponse> {
    if (this.cachedChallenges !== null) {
      // Si hay datos en caché, devolverlos como un Observable
      return of(this.cachedChallenges)
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    })
    return this.http.get<ChallengeResponse>('assets/dummy/challenges-mock.json', {
        // 🧪 MOCK TEMPORAL - Endpoint real: ${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ALL_CHALLENGES_URL}
      headers
    }).pipe(
      tap((response) => {
        this.cachedChallenges = response
      }))
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

    // Ordenar según el criterio seleccionado
    sortedChallenges.sort((a: Challenge, b: Challenge) => {
      let comparison = 0

      if (sortBy === 'creation_date') {
        const dateA = new Date(a.creation_date)
        const dateB = new Date(b.creation_date)
        // Si isAscending es true, queremos el más reciente primero
        comparison = isAscending ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime()
      } else if (sortBy === 'popularity') {
        const scoreA = a.timesFavorite ?? 0
        const scoreB = b.timesFavorite ?? 0
        // Si isAscending es true, queremos el de menor popularidad primero (de menos a más)
        // Ascendente (de menos a más): scoreA - scoreB
        // Descendente (de más a menos): scoreB - scoreA
        comparison = isAscending ? scoreA - scoreB : scoreB - scoreA
      }

      return comparison // Devolvemos el resultado de comparación
    })

    // Aplicar paginación
    const paginatedChallenges = sortedChallenges.slice(offset, offset + limit)

    return new Observable<Challenge[]>(observer => {
      observer.next(paginatedChallenges)
      observer.complete()
    })
  }

  getAllChallengesFiltered (filters: FilterChallenge, respArray: Challenge[]): Observable<any[]> {
    return of(respArray).pipe(
      map(challenges => {
        return challenges.filter(challenge => {
          const languageMatch = filters.languages.length === 0 || challenge.languages.every(lang => filters.languages.includes(lang.id_language))

          const levelMatch = filters.levels.length === 0 || filters.levels.includes(challenge.level.toUpperCase())

          // todo: need to implement progress filter
          return languageMatch && levelMatch // Usar '&&' en lugar de '||' para que ambos criterios se cumplan
        })
      })
    )
  }
}
