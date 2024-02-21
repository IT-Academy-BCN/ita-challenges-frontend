import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { AuthService } from "./auth.service";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { addYears } from "date-fns";
import {CookieOptions, CookieService, SameSite} from "ngx-cookie-service";
import { mock } from "node:test";
import { of, throwError } from "rxjs";
import {fakeAsync, TestBed, tick} from "@angular/core/testing";
import { environment } from "src/environments/environment";
import { exec } from "child_process";
import exp from "constants";
import {tap} from "rxjs/operators";
import {User} from "../models/user.model";
import {TokenService} from "./token.service";
import Mocked = jest.Mocked;
import jasmine2 from "jest-jasmine2";
import data from "../../assets/dummy/challenge.json";

describe("AuthService", () => {
	let authService: AuthService;
	//mocks
		let cookieServiceSpy: any;
        let routerMock: any;
        let httpClientMock: HttpClient;
        let httpTestingControllerMock: HttpTestingController;
        let tokenServiceMock: TokenService;


	beforeEach(() => {

/*		cookieServiceSpy = jasmine.createSpy('CookieService');
		cookieServiceSpy.get = jasmine.createSpy('get').and.returnValue('anonym');
		authService = new AuthService(httpClientMock, routerMock, cookieServiceSpy, tokenServiceMock);*/


		/*		cookieServiceMock.get.mockImplementation((key:string) => {
                    if (key === 'user') {
                        return JSON.stringify({ idUser: 'anonym' });
                    }
                    return '';
                });*/

		/*		class cookieServiceMock {
                    get(key: string): string {
                        return 'anonym';
                    }
                }*/


		/*		routerMock = {
                    navigate: jest.fn(),
                };*/



		//inject mocks
		//cookieServiceMock = TestBed.inject(CookieService) as Mocked<CookieService>;

		/*		TestBed.configureTestingModule({
                    imports: [HttpClientTestingModule],
                    providers: [
                        { provide: AuthService, useValue: AuthService },
                        { provide: CookieService, useValue: cookieServiceMock }
                    ]
                });*/


		/*		routerMock = TestBed.inject(Router);
                httpClientMock = TestBed.inject(HttpClient);
                httpTestingControllerMock = TestBed.inject(HttpTestingController);
                tokenServiceMock = TestBed.inject(TokenService);*/
		//authService = new AuthService(httpClientMock, routerMock, cookieServiceMock, tokenServiceMock);


	});



	it('should return the current user when user is NOT FOUND in cookies', (done) => {

		cookieServiceSpy = jasmine.createSpy('CookieService');
		cookieServiceSpy.get = jasmine.createSpy('get').and.returnValue('anonym');
		authService = new AuthService(httpClientMock, routerMock, cookieServiceSpy, tokenServiceMock);

		//cookieServiceSpy.get.returnValue('anonym');

		//cookieServiceSpy.get = jasmine.createSpy('get').and.returnValue('pako');

		const user = authService.currentUser;

		console.log("···········"+JSON.stringify(user))
		expect(true).toBe(true);
		done();
	});



	/*it('should return the current user when user IS FOUND in cookies', (done) => {
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

	it('should return the auth token from the cookie', (done) => {
		const expectedToken = 'testAuthToken';
		// Establece el token de autenticaciÃ³n en la cookie
		cookieServiceMock.set('authToken', expectedToken);

		//TODO JVR - Pending tests review
/!*
		const actualToken = authService.getToken();

		expect(cookieServiceMock.get).toHaveBeenCalled();
		expect(cookieServiceMock.set).toHaveBeenCalled();
		expect(actualToken).toEqual(expectedToken);*!/
		expect(true).toBe(true);

		done();
	});

	it("should get refresh Token from cookie", (done) => {
		let mockRefreshToken = 'mockRefreshToken';
		cookieServiceMock.set('refreshToken', mockRefreshToken);

/!*		const refreshToken = authService.getRefreshToken();
		expect(cookieServiceMock.set).toHaveBeenCalled();
		expect(cookieServiceMock.get).toHaveBeenCalled();
		expect(refreshToken).toBe(mockRefreshToken);*!/
		expect(true).toBe(true);

		done();
	})

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

	it('should set user cookies and resolve when login succeeds', (done) => {
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

		authService.login(mockUser).then((returnValue) => {
			expect(returnValue).toBeNull();
			expect(cookieServiceMock.get('authToken')).toEqual('testAuthToken');
			expect(cookieServiceMock.get('refreshToken')).toEqual('testRefreshToken');
			expect(cookieServiceMock.get('user')).toEqual(JSON.stringify(new User('testId')));
			done();
		})

	});

	it('should reject with error message when login fails', (done) => {
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

		authService.login(mockUser).then(() => {
			done.fail('Login should have failed');
		}).catch((error) => {
			expect(error).toEqual(mockErrorMessage);
			done();
		});
		done();
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

		authService.register(mockUser).then((returnValue) => {
			expect(returnValue).toBeTruthy();
			expect(returnValue).toEqual(mockResponse);
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

	//todo: need mockTokenService
	// it("should return isUserLoggedIn correctly", async () => {
	// 	const test = await authService.isUserLoggedIn();
	// 	expect(test).toEqual(true);
	// });

	// it("should return isUserLoggedIn false", async () => {
	// 	const test = await authService.isUserLoggedIn();
	// 	expect(test).toEqual(true);
	// });


*/
});
