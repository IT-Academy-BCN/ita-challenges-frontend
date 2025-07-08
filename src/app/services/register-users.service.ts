import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RegisterUsersService {
  constructor(private http: HttpClient) {}

  registerUser(username: string): Observable<any> {
    return this.http.post('{BACKEND_ITA_CHALLENGE_BASE_URL}/{CREATE_USER}', { username });
  }
}