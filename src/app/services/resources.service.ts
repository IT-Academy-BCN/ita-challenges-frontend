import { HttpClient } from '@angular/common/http'
import { Inject, Injectable } from '@angular/core'
import { type Observable } from 'rxjs'
import { environment } from 'src/environments/environment'
import { type ResourceResponse } from '../models/resource.interface'

@Injectable({
  providedIn: 'root'
})
export class ResourcesService {
  // private readonly http = inject(HttpClient)

  // TODO: Hardcoded URL.
  private readonly HARDCODED_URL: string = '/categorySlug=react'

  constructor (@Inject(HttpClient) private readonly http: HttpClient) { }
  getResources (): Observable<ResourceResponse> {
    return this.http.get<ResourceResponse>(environment.BACKEND_ITA_WIKI_BASE_URL.concat(environment.BACKEND_ITA_WIKI_RESOURCES),
      {
        headers: {
          'Content-Type': 'application/json'
        }
      })
  }
}
