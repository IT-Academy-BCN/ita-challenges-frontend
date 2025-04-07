import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userRole: string = '';
  private userRoleSubject = new BehaviorSubject<string>('');
  private userIdSubject = new BehaviorSubject<string | null>(null);
  private username: string = '';
  private usernameSubject = new BehaviorSubject<string>('');
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.checkAuthToken());
  public isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) {}

  getUserId(): Observable<string | null> {
    return this.userIdSubject.asObservable();
  }

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
      const userId = decodedToken?.uuid ?? null;
      this.userIdSubject.next(userId);
    } else {
      this.userRoleSubject.next('');
      this.usernameSubject.next('');
      this.userIdSubject.next(null);
    }

    this.updateAuthStatus();
  }

  isUserLoggedIn(): boolean {
    return this.checkAuthToken();
  }


  private checkAuthToken(): boolean {
    return localStorage.getItem('authToken') !== null;

  }

  private updateAuthStatus(): void {
    this.isLoggedInSubject.next(this.checkAuthToken());
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
        this.toastr.success('Logout successful', 'Success', { timeOut: 3000 });

        localStorage.removeItem('authToken');
        localStorage.removeItem('username');
        this.router.navigate([environment.REDIRECT_URL]);
        this.updateAuthStatus();
        this.updateUserRoleAndUserNameFromToken();
    },
    error: (error) => {
      this.toastr.error('Logout failed in backend', 'Error', { timeOut: 3000 });
    },
  });
}
}