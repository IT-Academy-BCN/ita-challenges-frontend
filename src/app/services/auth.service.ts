/* eslint-disable @typescript-eslint/semi */
/* eslint-disable @typescript-eslint/space-before-function-paren */
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core'
import { timeStamp } from 'node:console';


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

  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService, private translate: TranslateService) {
    this.translate.addLangs(['en', 'es', 'ca'])
    this.translate.setDefaultLang('ca')
    this.translate.use('ca')
  }

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
    const tokenActual = localStorage.getItem('authToken') // recuperamos el token guardado
    if (tokenActual == null) {
      return false // si no hay token, el user no está autenticado
    }
    // const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0dXNlciIsInJvbGUiOiJ1c2VyIiwidXVpZCI6InNvbWUtdXVpZCIsImlhdCI6MTYwOTAwMDAwMCwiZXhwIjoxNjA5MDAwMDAwfQ.7_oGkp_jLTt5Vaj04LJwpx3rK55BC1C0U4pNHO2HKeA';
    return !this.isTokenExpired(tokenActual) // si hay token, miramos si está expirado o no
  }

  checkAndHandleExpiredToken(): void {
    const tokenActual = this.getAuthToken()
    if (tokenActual != null && this.isTokenExpired(tokenActual)) {
      console.log('Tu token ha expirado')
      this.toastr.warning(this.translate.instant("Token expirado"), '', { timeOut: 3000 });
      this.clearAuthData()
      setTimeout(() => {
        this.logout()
      }, 5000)
    }
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

  private isTokenExpired (token: string): boolean { // MIRAMOS SI EL TOKEN HA EXPIRADO
    const decoded = this.decodeToken(token); // decodificamos el token
    if (!decoded || !decoded.exp) return true // si no hay token o fecha de expiración, lo consideramos expirado

    const expiryTime = decoded.exp * 1000 // si hay token, convertimos la expiración a milisegundos
    return Date.now() > expiryTime // miramos si ha expirado o no comparando con la fecha actual. si la fecha actual es mayo, ya ha expirado.
  }

  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getAuthHeaders(): { Authorization: string } {
    const token = this.getAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : { Authorization: '' };
  }

  clearAuthData(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
  }

  private handleLogoutSuccess(): void {
    this.toastr.success(this.translate.instant("messages.success.logout"), '', { timeOut: 3000 });
    this.clearAuthData();
    this.router.navigate([environment.AUTH_REDIRECT_URL]);
    this.updateAuthStatus();
    this.updateUserRoleAndUserNameFromToken();
  }

  logout(): void {
    const url = `${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_LOGOUT_ENDPOINT}`;

    this.http.post(url, {}, { headers: this.getAuthHeaders() }).subscribe({
    next: () => this.handleLogoutSuccess(),
    error: () => this.toastr.error(this.translate.instant("messages.errors.logout"), '', { timeOut: 3000 }),
  });
}
}