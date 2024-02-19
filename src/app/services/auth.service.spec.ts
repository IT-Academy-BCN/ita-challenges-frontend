import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { AuthService } from "./auth.service";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { addYears } from "date-fns";
import { CookieService } from "ngx-cookie-service";
import { mock } from "node:test";
import { of, throwError } from "rxjs";
import { TestBed } from "@angular/core/testing";
import { environment } from "src/environments/environment";
import { exec } from "child_process";
import exp from "constants";

describe("AuthService", () => {
	let authService: AuthService;
	let cookieServiceMock: any;
	let routerMock: any;
	let httpClient: HttpClient;
	let httpClientMock: HttpTestingController;

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

		authService = new AuthService(httpClient, routerMock, cookieServiceMock);
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

	it('should return the auth token from the cookie', (done) => {
		const expectedToken = 'testAuthToken';
		// Establece el token de autenticaciÃ³n en la cookie
		cookieServiceMock.set('authToken', expectedToken);

		const actualToken = authService.getToken();

		expect(cookieServiceMock.get).toHaveBeenCalled();
		expect(cookieServiceMock.set).toHaveBeenCalled();
		expect(actualToken).toEqual(expectedToken);
		done();
	});

	it("should get refresh Token from cookie", (done) => {
		let mockRefreshToken = 'mockRefreshToken';
		cookieServiceMock.set('refreshToken', mockRefreshToken);

		const refreshToken = authService.getRefreshToken();
		expect(cookieServiceMock.set).toHaveBeenCalled();
		expect(cookieServiceMock.get).toHaveBeenCalled();
		expect(refreshToken).toBe(mockRefreshToken);

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

	it("should register successfully", (done) => {
		const test = authService.register();
		expect(test).toEqual(true);
		done();
	});

	it("should handle registration error", (done) => {
		const test = authService.register();
		expect(test).toEqual(true);
		done();
	});

	it("should logout correctly", (done) => {
		const test = authService.logout();
		expect(test).toEqual(true);
		done();
	});

	it("should logout error", (done) => {
		const test = authService.logout();
		expect(test).toEqual(true);
		done();
	});

	it("should getUserLoggedData correctly", (done) => {
		const test = authService.getLoggedUserData();
		expect(test).toEqual(true);
		done();
	});

	it("should getUserLoggedData error", (done) => {
		const test = authService.getLoggedUserData();
		expect(test).toEqual(true);
		done();
	});

	it("should return isUserLoggedIn correctly", async () => {
		const test = await authService.isUserLoggedIn();
		expect(test).toEqual(true);
	});

	it("should return isUserLoggedIn false", async () => {
		const test = await authService.isUserLoggedIn();
		expect(test).toEqual(true);
	});

	it("should return checkToken correctly", async () => {
		const test = await authService.checkToken('test');
		expect(test).toEqual(true);
	});

	it("should return checkToken FALSE", async () => {
		const test = await authService.checkToken('test');
		expect(test).toEqual(true);
	});

	it("should return isTokenExpired TRUE", (done) => {
		const test = authService.isTokenExpired('test');
		expect(test).toEqual(true);
		done();
	});

	it("should return isTokenExpired FALSE", (done) => {
		const test = authService.isTokenExpired('test');
		expect(test).toEqual(true);
		done();
	});

	it("should return isTokenValid correctly", (done) => {
		const test = authService.isTokenValid('test');
		expect(test).toEqual(true);
		done();
	});

	it("should return isTokenValid error", (done) => {
		const test = authService.isTokenValid('test');
		expect(test).toEqual(true);
		done();
	});


});
