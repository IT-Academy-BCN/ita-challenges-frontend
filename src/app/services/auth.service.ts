import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core'


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
      try {
        const decodedToken = this.decodeToken(token);
        
        // Actualizar todos los estados en un solo batch
        const updates = {
          role: decodedToken?.role ?? '',
          username: decodedToken?.sub ?? '',
          userId: decodedToken?.uuid ?? null
        };

        // Aplicar todas las actualizaciones juntas
        this.userRole = updates.role;
        this.username = updates.username;
        
        // Emitir actualizaciones en bloque
        this.userRoleSubject.next(updates.role);
        this.usernameSubject.next(updates.username);
        this.userIdSubject.next(updates.userId);
        
        // Una única actualización del estado de autenticación
        this.isLoggedInSubject.next(true);
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        this.clearAuthData();
      }
    } else {
      // Limpiar todos los estados en caso de no tener token
      this.clearAuthData();
    }
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