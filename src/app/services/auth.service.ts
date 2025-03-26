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

  constructor(private _cookieService: CookieService) {
    this.updateUserRoleFromToken();
  }

  getUserRole(): Observable<string> {
    return this.userRoleSubject.asObservable();
  }

  // Method to update the user role when authentication changes
  updateUserRoleFromToken(): void {
    const token = this._cookieService.get('authToken');
    if (token) {
      const decodedToken = this.decodeToken(token);
      this.userRole = decodedToken?.role ?? '';
      this.userRoleSubject.next(this.userRole);
    } else {
      this.userRoleSubject.next('');
    }
  }

  isUserLoggedIn(): boolean {
    return this._cookieService.check('authToken');
  }


  setAuthToken(token: string): void {
    this._cookieService.set('authToken', token, {path: '/', secure: true, sameSite: 'Strict'});
    this.updateUserRoleFromToken();
  }


  logout(): void {
    this._cookieService.delete('authToken', '/');
    this.userRoleSubject.next('');
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