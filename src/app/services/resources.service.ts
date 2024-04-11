import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { type Observable } from 'rxjs'
import { environment } from 'src/environments/environment'
import { type ResourceResponse } from '../models/resource.interface'

@Injectable({
  providedIn: 'root'
})
export class ResourcesService {
  private readonly http = inject(HttpClient)
  
  getResources (): Observable<ResourceResponse> {
    // todo: need change the env api request.
    return this.http.get<ResourceResponse>(`${environment.BACKEND_SSO_RESOURCES}`,
      {
        headers: {
          'Content-Type': 'application/dummy'
        }
      })
  }
}
