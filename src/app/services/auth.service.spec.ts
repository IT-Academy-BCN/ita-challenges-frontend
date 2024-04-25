import { error } from 'console';
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { AuthService } from "./auth.service";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { addYears } from "date-fns";
import { CookieService } from "ngx-cookie-service";
import { mock } from "node:test";
import { of, throwError } from "rxjs";
import {fakeAsync, flushMicrotasks, TestBed, tick} from "@angular/core/testing";
import { environment } from "src/environments/environment";
import { exec } from "child_process";
import exp from "constants";
import {tap} from "rxjs/operators";
import {User} from "../models/user.model";
import {TokenService} from "./token.service";
import { resolve } from "path";
import { CookieEncryptionHelper } from "../helpers/cookie-encryption.helper";

describe("AuthService", () => {
	let authService: AuthService;
	let cookieServiceMock: any;
	let routerMock: any;
	let httpClient: HttpClient;
	let httpClientMock: HttpTestingController;
	let tokenServiceMock: TokenService;
	let helperMock: CookieEncryptionHelper;

  beforeEach(() => {

    TestBed.configureTestingModule({ // set up the testing module with required dependencies.
      imports: [HttpClientTestingModule]
    });

    // Inject the http service and test controller for each test
    httpClient = TestBed.inject(HttpClient); //TestBed.inject is used to inject into the test suite
    httpClientMock = TestBed.inject(HttpTestingController);

    routerMock = {
      navigate: jest.fn(),
    };
    cookieServiceMock = (function () {
      let cookies: { [key: string]: any } = {};
      return {
        get: jest.fn((key) => cookies[key] || null),
        set: jest.fn((key, value) => {
          cookies[key] = value;
        }),
        delete: jest.fn((key) => {
          delete cookies[key];
        }),
      };
    })();
    Object.defineProperty(window, "cookies", {
      writable: true,
      value: cookieServiceMock,
    });

		authService = new AuthService(httpClient, routerMock, cookieServiceMock, tokenServiceMock, helperMock);
	});

  it('should return the current user when user is NOT FOUND in cookies', (done) => {
    const anonymMock = 'anonym';

    cookieServiceMock.get.mockReturnValue(null); // Set cookie service to return null

    const user = authService.currentUser;

    expect(user).toBeDefined();
    expect(user.idUser).toBe(anonymMock);

    expect(cookieServiceMock.get).toHaveBeenCalledWith('user');

    done();
  });

  it('should return the current user when user IS FOUND in cookies', (done) => {
    const mockUser = {
      idUser: 'mockIdUser',
      dni: 'mockDni',
      email: 'mockEmail'
    };

    authService.currentUser = mockUser;

    const user = authService.currentUser;

    expect(user).toBeDefined();
    expect(user).toBe(mockUser);
    expect(cookieServiceMock.get).toHaveBeenCalledWith('user');

    done();
  });

  it('should set current user in cookie and in behavior subject', (done) => {
    let testUser = {
      idUser: 'mockIdUser',
      dni: 'mockDni',
      email: 'mockEmail',
    };

    authService.currentUser = testUser;

    expect(cookieServiceMock.set).toHaveBeenCalled();

    authService.user$.subscribe(user => {
      expect(user).toBe(testUser);
    })

    done();
  });


  it("should return userId from cookie", (done) => {
    let mockUser = {
      idUser: 'mockIdUser',
      dni: 'mockDni',
      email: 'mockEmail'
    };

    cookieServiceMock.set('user', JSON.stringify(mockUser));

    const userId = authService.getUserIdFromCookie();

    expect(cookieServiceMock.set).toHaveBeenCalled();
    expect(cookieServiceMock.get).toHaveBeenCalled();
    expect(userId).toEqual(mockUser.idUser)

    done();
  });

  it("should make successful login request", (done) => {
    let testUser = {
      idUser: '',
      dni: 'testDni',
      password: 'testPassword',
    };

    let mockResponse = {
      "authToken": "testAuthToken",
      "refreshToken": "testRefreshToken",
      "id": "testId"
    };

    authService.loginRequest(testUser)
        .subscribe({
          next: (res) => {
            expect(res).toBeTruthy();
            expect(res).toEqual(mockResponse);
          }
        });

    const req = httpClientMock.expectOne(environment.BACKEND_ITA_SSO_BASE_URL.concat(environment.BACKEND_SSO_LOGIN_URL));
    expect(req.request.method).toEqual("POST");

    req.flush(mockResponse);
    done();
  });

  it("should make UNsuccessful login request", (done) => {
    let testUser = {
      idUser: '',
      dni: 'testDni',
      password: 'testPassword',
    };

    let mockResponse = {
      "message": "Invalid Credentials"
    };

    authService.loginRequest(testUser)
        .subscribe({
          error: (err) => {
            expect(err).toBeTruthy();
            expect(err).toEqual(mockResponse);
          }
        });

    const req = httpClientMock.expectOne(environment.BACKEND_ITA_SSO_BASE_URL.concat(environment.BACKEND_SSO_LOGIN_URL));
    expect(req.request.method).toEqual("POST");

    req.flush(mockResponse);
    done();
  });

  it('should set user cookies and resolve when login succeeds', async () => {
    const mockUser: User = {
      idUser: '',
      dni: 'testDni',
      password: 'testPassword',
    };

    let mockResponse = { // response we expect from the loginRequest function.
      "authToken": "testAuthToken",
      "refreshToken": "testRefreshToken",
      "id": "testId"
    };

    //spyOn function to mock the behavior of the loginRequest function.
    spyOn(authService, 'loginRequest').and.returnValue(of(mockResponse)); // Import 'of' from 'rxjs' if not already imported

    try{
      authService.login(mockUser).then((returnValue) => {
        expect(returnValue).toBeNull();
        expect(cookieServiceMock.get('authToken')).toEqual('testAuthToken');
        expect(cookieServiceMock.get('refreshToken')).toEqual('testRefreshToken');
        expect(cookieServiceMock.get('user')).toEqual(JSON.stringify(new User('testId')));
      })
    } catch (error) {
      fail('Login failed');
    }


  });

  it('should reject with error message when login fails', async () => {
    const mockUser: User = {
      idUser: '',
      dni: 'testDni',
      password: 'testPassword',
    };

    let mockErrorMessage = 'Invalid Credentials';
    let mockErrorResponse = { // response we expect from the loginRequest function.
      message: mockErrorMessage
    };

    spyOn(authService, 'loginRequest').and.returnValue(
        of({}).pipe(
            tap(() => {
              throw { status: 401, error: mockErrorResponse };
            })
        )
    );

    try {
      await authService.login(mockUser);
      fail('Login should have failed');

    } catch (error:any) {
      expect(error.error.message).toEqual(mockErrorMessage);
    }
  });

  it("should register request successfully", (done) => {
    const mockUser = {
      idUser:'',
      dni: 'mockUserDni',
      email: 'mockUserEmail',
      name: 'mockUserName',
      itineraryId: 'mockUserIteneraryId',
      password:'mockUserPassword',
      confirmPassword: 'mockUserConfirmPassword',
    };

    const mockResponse = {
      id: 'mockIdResponse'
    }

    authService.registerRequest(mockUser)
        .subscribe({
          next: (res) => {
            expect(res).toBeTruthy();
            expect(res).toEqual(mockResponse);
          }
        });

    const req = httpClientMock.expectOne(environment.BACKEND_ITA_SSO_BASE_URL.concat(environment.BACKEND_SSO_REGISTER_URL));
    expect(req.request.method).toEqual("POST");

    req.flush(mockResponse);
    done();
  });

  it("should register request UNsuccessful", (done) => {
    const mockUser = {
      idUser:'mockIdResponse',
      dni: 'mockUserDni',
      email: 'mockUserEmail',
      name: 'mockUserName',
      itineraryId: 'mockUserIteneraryId',
      password:'mockUserPassword',
      confirmPassword: 'mockUserConfirmPassword',
    };

    const mockResponse = {
      id: 'mockIdResponse'
    }

    authService.loginRequest(mockUser)
        .subscribe({
          error: (err) => {
            expect(err).toBeTruthy();
            expect(err).toEqual(mockResponse);
          }
        });

    const req = httpClientMock.expectOne(environment.BACKEND_ITA_SSO_BASE_URL.concat(environment.BACKEND_SSO_LOGIN_URL));
    expect(req.request.method).toEqual("POST");

    req.flush(mockResponse);
    done();
  });

  it ("should show success register modal", (done) => {
    const mockUser = {
      idUser:'mockIdResponse',
      dni: 'mockUserDni',
      email: 'mockUserEmail',
      name: 'mockUserName',
      itineraryId: 'mockUserIteneraryId',
      password:'mockUserPassword',
      confirmPassword: 'mockUserConfirmPassword',
    };

    const mockResponse = {
      id: 'mockIdResponse'
    }

    //spyOn function to mock the behavior of the loginRequest function.
    spyOn(authService, 'registerRequest').and.returnValue(of(mockResponse)); // Import 'of' from 'rxjs' if not already imported
    spyOn(authService, 'modifyUserWithAdmin');

    authService.register(mockUser).then((returnValue) => {
      expect(returnValue).toBeTruthy();
      expect(returnValue).toEqual(mockResponse);
      expect(resolve).toEqual(null);
      expect(authService.modifyUserWithAdmin).toHaveBeenCalledWith(mockResponse.id);
      done();
    });
    done();
  });

  it ("should show UNsuccessly register modal", (done) => {
    const mockUser = {
      idUser:'mockIdResponse',
      dni: 'mockUserDni',
      email: 'mockUserEmail',
      name: 'mockUserName',
      itineraryId: 'mockUserIteneraryId',
      password:'mockUserPassword',
      confirmPassword: 'mockUserConfirmPassword',
    };

    let mockErrorMessage = 'Invalid data';
    let mockErrorResponse = { // response we expect from the loginRequest function.
      message: mockErrorMessage
    };

    spyOn(authService, 'registerRequest').and.returnValue(
        of({}).pipe(
            tap(() => {
              throw { status: 401, error: mockErrorResponse };
            })
        )
    );

    authService.register(mockUser).then(() => {
      done.fail('Register should have failed');
    }).catch((error) => {
      expect(error).toEqual(mockErrorMessage);
      done();
    });
    done();
  });

  it("should logout correctly", (done) => {

    let user = 'user';
    let authToken = 'testAuthToken';
    let refreshToken = 'testRefreshAuthToken';

    cookieServiceMock.set('user', user);
    cookieServiceMock.set('authToken', authToken);
    cookieServiceMock.set('refreshToken', refreshToken)

    authService.logout();
    expect(cookieServiceMock.get).toHaveBeenCalled();

    expect(cookieServiceMock.delete).toHaveBeenCalledWith("user");
    expect(cookieServiceMock.delete).toHaveBeenCalledWith("authToken");
    expect(cookieServiceMock.delete).toHaveBeenCalledWith("refreshToken");

    let currentUser = authService.currentUser;
    expect(currentUser.idUser).toBe('anonym');

    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
    done();
  });

  it("should getLoggedUserData correctly", fakeAsync(() => {

    let testAuthToken = 'testAuthToken';
    const mockUser = {
      idUser: 'mockIdUser',
      dni: 'mockDni',
      email: 'mockEmail'
    };

    const mockResponse = {
      dni: "string",
      email: "user@example.cat",
      role: "ADMIN"
    }

    cookieServiceMock.set('authToken', testAuthToken);
    authService.currentUser = mockUser;

    const user = authService.currentUser;
    authService.getLoggedUserData();

    const req = httpClientMock.expectOne(environment.BACKEND_ITA_SSO_BASE_URL.concat(environment.BACKEND_SSO_POST_USER));
    expect(req.request.method).toEqual('POST');

    req.flush(mockResponse);
    tick();
    expect(authService.currentUser).toEqual({
      idUser: mockUser.idUser,
      dni: mockResponse.dni, // Updated with server response
      email: mockResponse.email, // Updated with server response
    });

    expect(user).toBeDefined();
    expect(user).toBe(mockUser);
  }));

  it("should handle error in getLoggedUserData", (done) => {

    spyOn(console, 'error'); //spy console.error

    // Simulamos un evento de progreso para indicar un error
    const errorEvent = new ProgressEvent('error', {
      lengthComputable: false,
      loaded: 0,
      total: 0,
    });

    authService.getLoggedUserData();
    const req = httpClientMock.expectOne(environment.BACKEND_ITA_SSO_BASE_URL.concat(environment.BACKEND_SSO_POST_USER));

    req.error(errorEvent);
    expect(console.error).toHaveBeenCalled;
    done();
  });

  it("should modifyUserWithAdmin correctly", fakeAsync(() => {
    let userAdminMock = {
      idUser: '',
      dni: '12345678Z',
      password:'passwordMock'
    }

    let mockResAfterLogin = {
      id: 'adminIdMock',
      authToken: 'testAuthToken',
      refreshToken: 'refreshToken'
    }

    cookieServiceMock.set('authToken', mockResAfterLogin.authToken);

    let mockRegisterUserId = 'wig98drksz4se2wpgbnouu4w';

    let mockLoggedUserData = {
      dni: '12345678Z',
      email: 'mock@mock.com',
      role: 'ADMIN'
    }

    let mockResponse = {
      message: 'User has been modified',
    }
    spyOn(authService, 'login').and.returnValue(Promise.resolve(mockResAfterLogin));
    spyOn(authService, 'getLoggedUserData').and.returnValue(Promise.resolve(mockLoggedUserData));

    authService.modifyUserWithAdmin(mockRegisterUserId).then(() => {
      const reqAdmin = httpClientMock.expectOne(environment.ADMIN_USER);
      expect(reqAdmin.request.method).toEqual('GET');
      reqAdmin.flush(mockResAfterLogin);


      expect(mockLoggedUserData.role).toBe('ADMIN');
      expect(authService.login).toHaveBeenCalledWith(userAdminMock);
      expect(authService.getLoggedUserData).toHaveBeenCalled();


      const req = httpClientMock.expectOne(`${environment.BACKEND_ITA_SSO_BASE_URL}${environment.BACKEND_SSO_PATCH_USER}/${mockRegisterUserId}`);
      expect(req.request.method).toEqual('PATCH');
      expect(req.request.headers.get('Content-Type')).toEqual('application/json');
      req.flush(mockResponse);

      expect(authService.logout).toHaveBeenCalled();
    }).catch((error) => {
      fail('Error modifying user: ' + error);
    });

    tick();

  }));

  it('should return true if authToken is valid', async () => {
    cookieServiceMock.get.mockReturnValueOnce('validAuthToken');
    authService.checkToken = jest.fn().mockResolvedValueOnce(true);

    const result = await authService.isUserLoggedIn();

    expect(result).toBe(true);
  });

  it('should return true if authToken is invalid but refreshToken is valid', async () => {
    cookieServiceMock.get.mockReturnValueOnce('invalidAuthToken').mockReturnValueOnce('validRefreshToken');
    authService.checkToken = jest.fn().mockResolvedValueOnce(false).mockResolvedValueOnce(true);

    const result = await authService.isUserLoggedIn();

    expect(result).toBe(true);
  });

  it('should return false if both authToken and refreshToken are invalid', async () => {
    cookieServiceMock.get.mockReturnValueOnce('invalidAuthToken').mockReturnValueOnce('invalidRefreshToken');
    authService.checkToken = jest.fn().mockResolvedValueOnce(false).mockResolvedValueOnce(false);

    const result = await authService.isUserLoggedIn();

    expect(result).toBe(false);
  });

});
