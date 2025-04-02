import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { CookieService } from 'ngx-cookie-service';
import { first } from 'rxjs/operators';

describe('AuthService', () => {
  let service: AuthService;
  let cookieService: CookieService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CookieService]
    });
    service = TestBed.inject(AuthService);
    cookieService = TestBed.inject(CookieService);
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

    service.updateUserRoleFromToken();

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

  it('should emit updated role when updateUserRoleFromToken is called', fakeAsync(() => {
    let initialRole: string | undefined;
    service.getUserRole().pipe(first()).subscribe(r => initialRole = r);
    tick();
    expect(initialRole).toBe('');

    const token = btoa(JSON.stringify({ role: 'ADMIN' }));
    localStorage.setItem('authToken', `header.${token}.signature`);
    service.updateUserRoleFromToken();

    let updatedRole: string | undefined;
    service.getUserRole().pipe(first()).subscribe(r => updatedRole = r);
    tick();
    expect(updatedRole).toBe('ADMIN');
  }));

  it('should emit empty role when token is removed', fakeAsync(() => {
    const token = btoa(JSON.stringify({ role: 'ADMIN' }));
    localStorage.setItem('authToken', `header.${token}.signature`);
    service.updateUserRoleFromToken();

    let initialRole: string | undefined;
    service.getUserRole().pipe(first()).subscribe(r => initialRole = r);
    tick();
    expect(initialRole).toBe('ADMIN');

    localStorage.removeItem('authToken');
    service.updateUserRoleFromToken();

    let updatedRole: string | undefined;
    service.getUserRole().pipe(first()).subscribe(r => updatedRole = r);
    tick();
    expect(updatedRole).toBe('');
  }));

  it('should return true if user is logged in (auth token exists)', () => {
    cookieService.set('authToken', 'test-token', { path: '/' });
    expect(service.isUserLoggedIn()).toBe(true);
  });

  it('should return false if user is not logged in (no auth token)', () => {
    cookieService.delete('authToken', '/');
    expect(service.isUserLoggedIn()).toBe(false);
  });

});