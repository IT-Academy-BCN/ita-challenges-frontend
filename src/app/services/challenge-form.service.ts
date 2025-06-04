import { Inject, Injectable } from '@angular/core'
import { type Language } from '../models/challenges.interface'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { type Observable } from 'rxjs'
import { environment } from 'src/environments/environment'
import { type TagResponse } from '../models/tag-response.interface'

@Injectable({
  providedIn: 'root'
})
export class ChallengeFormService {
  constructor (@Inject(HttpClient) private readonly http: HttpClient) {}

  getAllLangugesCreateForm (): Observable<{ results: Language[] }> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    })
    const url = `${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ALL_LANGUAGE_URL}`

    return this.http.get<{ results: Language[] }>(url, { headers })
  }

  getTags (): Observable<TagResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    })
    const url = `${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ITA_CHALLENGE_TAGS}`
    return this.http.get<TagResponse>(url, { headers })
  }

  getTagsByLanguage (languageId: string): Observable<TagResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    })
    const url = `../assets/dummy/tags-${languageId}.json`
    return this.http.get<TagResponse>(url, { headers })
  }
}
