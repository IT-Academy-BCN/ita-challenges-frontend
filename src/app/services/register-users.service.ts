import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, Observable, of, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RegisterUsersService {
  constructor(private readonly http: HttpClient) { }

  registerUser(username: string): Observable<any> {
    return this.http.post('{BACKEND_ITA_CHALLENGE_BASE_URL}/{CREATE_USER}', { username });
  }

  registerUserMock(username: string): Observable<any> {
    // simulaed successful registration
    return of({ message: `User ${username} registered successfully` }).pipe(delay(500));

    // simulated failure
    // return throwError(() => new Error(`Failed to register user ${username}`)).pipe(delay(500));
  }
}