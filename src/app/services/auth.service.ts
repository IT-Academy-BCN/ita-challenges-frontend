import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userRole: string = '';
  private userRoleSubject = new BehaviorSubject<string>('');
  private username: string = '';
  private usernameSubject = new BehaviorSubject<string>('');

  constructor() {
    // Initialize the role from localStorage on service creation
    this.updateUserRoleFromToken();
  }

  getUserRole(): Observable<string> {
    return this.userRoleSubject.asObservable();
  }

  getUsername(): Observable<string> {
    return this.usernameSubject.asObservable();
  }

  // Method to update the user role when authentication changes
  updateUserRoleFromToken(): void {
    const token = localStorage.getItem('authToken');
    if (!token) {
      this.userRole = '';
      this.userRoleSubject.next('');
      this.username = '';
      this.usernameSubject.next('');
      return;
    }
    
    const decodedToken = this.decodeToken(token);
    this.userRole = decodedToken?.role ?? '';
    this.userRoleSubject.next(this.userRole);
    this.username = decodedToken?.sub ?? '';
    this.usernameSubject.next(this.username);
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