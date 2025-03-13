import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { of } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return an empty string when there is no token', fakeAsync(() => {
    let role: string | undefined;
    service.getUserRole().subscribe(r => role = r);
    tick();
    expect(role).toBe('');
  }));

  it('should return the correct role when there is a valid token', fakeAsync(() => {
    const token = btoa(JSON.stringify({ role: 'ADMIN' }));
    localStorage.setItem('authToken', `header.${token}.signature`);

    let role: string | undefined;
    service.getUserRole().subscribe(r => role = r);
    tick();
    expect(role).toBe('ADMIN');
  }));

  it('should decode a valid token correctly', () => {
    const token = btoa(JSON.stringify({ role: 'ADMIN' }));
    const decodedToken = service['decodeToken'](`header.${token}.signature`);
    expect(decodedToken.role).toBe('ADMIN');
  });

  it('should return null for an invalid token', () => {
    const decodedToken = service['decodeToken']('invalid.token');
    expect(decodedToken).toBeNull();
  });
});