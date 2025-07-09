import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { RegisterUsersService } from './register-users.service';
import { provideHttpClient } from '@angular/common/http';

describe('RegisterUsersService', () => {
  let service: RegisterUsersService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        RegisterUsersService
      ],
    });
    service = TestBed.inject(RegisterUsersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register a user and return the response', () => {
    const mockUser = { username: 'testuser' };
    const mockResponse = { message: 'User registered successfully' };

    service.registerUser(mockUser.username).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('{BACKEND_ITA_CHALLENGE_BASE_URL}/{CREATE_USER}');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockUser);
    req.flush(mockResponse);
  });

  it('should handle an error when registering a user', () => {
    const mockUser = { username: 'testuser' };
    const mockError = { status: 500, statusText: 'Internal Server Error' };

    service.registerUser(mockUser.username).subscribe({
      next: () => fail('should have failed with a 500 error'),
      error: error => {
        expect(error.status).toEqual(500);
      }
    });

    const req = httpMock.expectOne('{BACKEND_ITA_CHALLENGE_BASE_URL}/{CREATE_USER}');
    expect(req.request.method).toBe('POST');
    req.flush(null, mockError);
  });

  it('should register a user with the mock service and return a success message', (done) => {
    const username = 'testuser';
    service.registerUserMockSuccess(username).subscribe(response => {
      expect(response).toEqual({ message: `User ${username} registered successfully` });
      done();
    });
  });

  it('should register a user with the mock service and return an error', (done) => {
    const username = 'testuser';
    service.registerUserMockFailure(username).subscribe({
      error: err => {
        expect(err.message).toEqual(`Failed to register user ${username}`);
        done();
      }
    });
  });
});
