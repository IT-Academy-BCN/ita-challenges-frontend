import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { first } from 'rxjs/operators';

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

    // Force the service to update the role from token
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
    // Initial state - no token
    let initialRole: string | undefined;
    service.getUserRole().pipe(first()).subscribe(r => initialRole = r);
    tick();
    expect(initialRole).toBe('');

    // Set token and update role
    const token = btoa(JSON.stringify({ role: 'ADMIN' }));
    localStorage.setItem('authToken', `header.${token}.signature`);
    service.updateUserRoleFromToken();

    // Check if role was updated
    let updatedRole: string | undefined;
    service.getUserRole().pipe(first()).subscribe(r => updatedRole = r);
    tick();
    expect(updatedRole).toBe('ADMIN');
  }));

  it('should emit empty role when token is removed', fakeAsync(() => {
    // Set initial token and role
    const token = btoa(JSON.stringify({ role: 'ADMIN' }));
    localStorage.setItem('authToken', `header.${token}.signature`);
    service.updateUserRoleFromToken();

    // Verify initial role
    let initialRole: string | undefined;
    service.getUserRole().pipe(first()).subscribe(r => initialRole = r);
    tick();
    expect(initialRole).toBe('ADMIN');

    // Remove token and update role
    localStorage.removeItem('authToken');
    service.updateUserRoleFromToken();

    // Check if role was updated to empty
    let updatedRole: string | undefined;
    service.getUserRole().pipe(first()).subscribe(r => updatedRole = r);
    tick();
    expect(updatedRole).toBe('');
  }));
});