import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResourceResponse } from '../models/resource.interface';

@Injectable({
  providedIn: 'root'
})
export class ResourcesService {

  constructor(private http: HttpClient) { }

  getResources(): Observable<ResourceResponse> {
    //todo: need change the env api request.
    return this.http.get<ResourceResponse>(`${environment.BACKEND_SSO_RESOURCES}`,
      {
        headers: {
          'Content-Type': 'application/dummy'
        }
      });
  }
}
