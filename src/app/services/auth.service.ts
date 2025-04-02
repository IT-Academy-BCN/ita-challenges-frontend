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
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.checkAuthToken());
  public isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();

  constructor(private _cookieService: CookieService) {
    this.updateUserRoleFromToken();
  }

  getUserRole(): Observable<string> {
    return this.userRoleSubject.asObservable();
  }

  // Method to update the user role when authentication changes
  updateUserRoleFromToken(): void {
    const token = localStorage.getItem('authToken');
    if (token) {
      const decodedToken = this.decodeToken(token);
      this.userRole = decodedToken?.role ?? '';
      this.userRoleSubject.next(this.userRole);
    } else {
      this.userRoleSubject.next('');
    }
    this.updateAuthStatus();
  }

  isUserLoggedIn(): boolean {
    return this._cookieService.check('authToken');
  }


  setAuthToken(token: string): void {
    this._cookieService.set('authToken', token, {path: '/', secure: true, sameSite: 'Strict'});
    this.updateUserRoleFromToken();
  }

  private checkAuthToken(): boolean {
    return this._cookieService.check('authToken');
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
}