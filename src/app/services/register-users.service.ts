import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, Observable, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment'

@Injectable({ providedIn: 'root' })
export class RegisterUsersService {
  constructor(private readonly http: HttpClient) { }

  registerUser(username: string): Observable<any> {
    return this.http.post(`${environment.BACKEND_ITA_CHALLENGE_BASE_URL}/${environment.CREATE_USER}`, { username });
  }

  registerUserMockSuccess(username: string): Observable<any> {
    // simulaed successful registration
    return of({ message: `User ${username} registered successfully` }).pipe(delay(500));
  }
  registerUserMockFailure(username: string): Observable<any> {

    // simulated failure
    return throwError(() => new Error(`Failed to register user ${username}`)).pipe(delay(500));
  }
}