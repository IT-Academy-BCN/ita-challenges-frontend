import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { first } from 'rxjs/operators';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';


describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);

  });

  afterEach(() => {
    localStorage.clear();
    httpMock.verify();
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

    service.updateUserRoleAndUserNameFromToken();

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

  it('should emit updated role when updateUserRoleAndUserNameFromToken is called', fakeAsync(() => {
    let initialRole: string | undefined;
    service.getUserRole().pipe(first()).subscribe(r => initialRole = r);
    tick();
    expect(initialRole).toBe('');

    const token = btoa(JSON.stringify({ role: 'ADMIN' }));
    localStorage.setItem('authToken', `header.${token}.signature`);
    service.updateUserRoleAndUserNameFromToken();

    let updatedRole: string | undefined;
    service.getUserRole().pipe(first()).subscribe(r => updatedRole = r);
    tick();
    expect(updatedRole).toBe('ADMIN');
  }));

  it('should emit empty role when token is removed', fakeAsync(() => {
    const token = btoa(JSON.stringify({ role: 'ADMIN' }));
    localStorage.setItem('authToken', `header.${token}.signature`);
    service.updateUserRoleAndUserNameFromToken();

    let initialRole: string | undefined;
    service.getUserRole().pipe(first()).subscribe(r => initialRole = r);
    tick();
    expect(initialRole).toBe('ADMIN');

    localStorage.removeItem('authToken');
    service.updateUserRoleAndUserNameFromToken();

    let updatedRole: string | undefined;
    service.getUserRole().pipe(first()).subscribe(r => updatedRole = r);
    tick();
    expect(updatedRole).toBe('');
  }));

  it('should return true if user is logged in (auth token exists)', () => {
    localStorage.setItem('authToken', 'test-token');
    expect(service.isUserLoggedIn()).toBe(true);
  });

  it('should return false if user is not logged in (no auth token)', () => {
    localStorage.removeItem('authToken');
    expect(service.isUserLoggedIn()).toBe(false);
  });

  it('should call backend logout and clear localStorage on logout', fakeAsync(() => {
    localStorage.setItem('authToken', 'test-token');
    localStorage.setItem('username', 'test-user');

    const logoutUrl = `${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_LOGOUT_ENDPOINT}`;
    const mockResponse = { message: 'Logout successful' };

    const routerSpy = spyOn(router, 'navigate');
    const updateAuthStatusSpy = spyOn<any>(service as any, 'updateAuthStatus');
    const updateUserRoleAndUserNameFromTokenSpy = spyOn(service, 'updateUserRoleAndUserNameFromToken');

    service.logout();

    const req = httpMock.expectOne(logoutUrl);
    expect(req.request.method).toBe('POST');

    req.flush(mockResponse);

    tick();

    expect(localStorage.getItem('authToken')).toBeNull();
    expect(localStorage.getItem('username')).toBeNull();

    expect(routerSpy).toHaveBeenCalledWith([environment.REDIRECT_URL]);
    expect(updateAuthStatusSpy).toHaveBeenCalled();
    expect(updateUserRoleAndUserNameFromTokenSpy).toHaveBeenCalled();
  }));

  it('should return authorization header with token if token exists', () => {
    localStorage.setItem('authToken', 'test-token');
    
    const headers = service.getAuthHeaders();

    expect(headers.Authorization).toBe('Bearer test-token');
  });

  it('should return empty authorization header if no token exists', () => {
    localStorage.removeItem('authToken');

    const headers = service.getAuthHeaders();
    expect(headers.Authorization).toBe('');
  });

});