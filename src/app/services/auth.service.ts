import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userRole: string = '';
  private userRoleSubject = new BehaviorSubject<string>('');
  private username: string = '';
  private usernameSubject = new BehaviorSubject<string>('');
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.checkAuthToken());
  public isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  getUserRole(): Observable<string> {
    return this.userRoleSubject.asObservable();
  }

  getUsername(): Observable<string> {
    return this.usernameSubject.asObservable();
  }

  updateUserRoleAndUserNameFromToken(): void {
    const token = localStorage.getItem('authToken');
    if (token) {
      const decodedToken = this.decodeToken(token);
      this.userRole = decodedToken?.role ?? '';
      this.userRoleSubject.next(this.userRole);
      this.username = decodedToken?.sub ?? '';
      this.usernameSubject.next(this.username);
    } else {
      this.userRoleSubject.next('');
      this.username = '';
      this.usernameSubject.next('');
    }
    this.updateAuthStatus();
  }

  isUserLoggedIn(): boolean {
    return localStorage.getItem('authToken') !== null;
  }


  private checkAuthToken(): boolean {
    return localStorage.getItem('authToken') !== null;

  }

  private updateAuthStatus(): void {
    const isLoggedIn = this.checkAuthToken();
    this.isLoggedInSubject.next(isLoggedIn);

  }

  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      return JSON.parse(decodedPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getAuthHeaders(): { Authorization: string } {
    const token = this.getAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : { Authorization: '' };
  }

  logout(): void {
    const url = `${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_LOGOUT_ENDPOINT}`;

    this.http.post(url, {}, { headers: this.getAuthHeaders() }).subscribe({
      next: (response) => {
        console.log(response);
    },
    error: (error) => {
      console.error('Logout failed in backend', error);
    },
    complete: () => {
      localStorage.removeItem('authToken');
      localStorage.removeItem('username');
      this.router.navigate([environment.REDIRECT_URL]);
      this.updateAuthStatus();
      this.updateUserRoleAndUserNameFromToken();
    }
  });
}
}