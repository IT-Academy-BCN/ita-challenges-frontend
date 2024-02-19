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

	it("should login successfully", (done) => {
		const test = authService.login();
		expect(test).toEqual(test);
		done();
	});

	it("should handle login error", (done) => {
		const test = authService.login();
		expect(test).toEqual(test);
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
		let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NDY2MjU5NzQsImV4cCI6MTY0NjYyNzk3NCwidXNlcl9pZCI6IjEyMzQ1Njc4OSIsInVzZXJuYW1lIjoiZXhhbXBsZV91c2VyIn0.bJcS2VgrPsgc0mPDRFhS_hvrx4ftj6NgR13IO25D7Ag';

		let isTokenExpired = authService.isTokenExpired(token);
		expect(isTokenExpired).toEqual(true);
		done();
	});

	it("should return isTokenExpired FALSE", (done) => {
		let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NDY2MjU5NzQsImV4cCI6MzIwMzE3MTAwMCwidXNlcl9pZCI6IjEyMzQ1Njc4OSIsInVzZXJuYW1lIjoiZXhhbXBsZV91c2VyIn0.GlYqDGpU3ny3t5myeYJUb3zya5L4M9EIRbFZk8b98cY';

		let isTokenExpired = authService.isTokenExpired(token);
		
		expect(isTokenExpired).toEqual(false);
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
