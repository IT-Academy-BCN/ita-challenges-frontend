import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userRole: string = '';

  constructor() {}

  getUserRole(): Observable<string> {
    const token = localStorage.getItem('authToken');
    return of(token).pipe(
      map(t => {
        if (!t) return '';
        const decodedToken = this.decodeToken(t);
        return decodedToken?.role ?? '';
      })
    );
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