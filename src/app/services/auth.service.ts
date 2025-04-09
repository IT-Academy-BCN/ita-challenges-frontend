import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

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

  constructor() {}

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
}