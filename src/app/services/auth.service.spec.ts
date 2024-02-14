import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { AuthService } from "./auth.service";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { of, throwError } from "rxjs";
import { TestBed } from "@angular/core/testing";
import { environment } from "src/environments/environment";

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
		// Establece el token de autenticación en la cookie
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

	it("should return user from Cookie", (done) => {
		let mockUser = {
			idUser: 'mockIdUser',
			dni: 'mockDni',
			email: 'mockEmail'
		};

		cookieServiceMock.set('user', JSON.stringify(mockUser));

		const user = authService.getUserFromCookie();

		expect(cookieServiceMock.set).toHaveBeenCalled();
		expect(cookieServiceMock.get).toHaveBeenCalled();
		expect(user).toMatchObject(mockUser)

		done();
	})


	it("should login successfully", (done) => {
		const mockUser = { authToken: "12345", refreshToken: "67890" };
		// httpClientMock.post.mockReturnValue(of(mockUser));

		/*		authService.login("username", "password").subscribe((user) => {
					expect(user).toEqual(mockUser);
					expect(localStorage.setItem).toHaveBeenCalledWith(
						"authToken",
						"12345"
					);
					expect(localStorage.setItem).toHaveBeenCalledWith(
						"refreshToken",
						"67890"
					);
					done();
				});*/
	});

	it("should handle login error", (done) => {
		const error = "Login failed";
		// httpClientMock.post.mockReturnValue(throwError(() => new Error(error)));

		/*		authService.login("username", "password").subscribe({
					next: () => {},
					error: (e) => {
						expect(e.message).toBe(error);
						done();
					},
				});*/
	});

	it("should register successfully", (done) => {
		let testUser = {
			idUser: '',
			dni: 'testDni',
			email: 'testEmail',
			name: 'testName',
			itineraryId: 'testItinerary',
			password: 'testPassword',
			confirmPassword: 'testConfirmPassword',
		};

		let mockResponse = {
			"id": "testId",
		};

		authService.register(testUser)
		.subscribe((res) => {
			expect(res).toBeTruthy();
			expect(res).toEqual(mockResponse);
		});

		// Check for correct requests: should have made one POST request from expected URL
		const req = httpClientMock.expectOne(environment.BACKEND_ITA_SSO_BASE_URL.concat(environment.BACKEND_SSO_REGISTER_URL));
		expect(req.request.method).toEqual("POST");
	
		req.flush(mockResponse);
		done();
	});

	it("should handle registration error", (done) => {
		const error = "Registration failed";
		// httpClientMock.post.mockReturnValue(throwError(() => new Error(error)));

		/*		authService
					.register({ dni: "123", password: "password" } as any)
					.subscribe({
						next: () => {},
						error: (e) => {
							expect(e.message).toBe(error);
							done();
						},
					});*/
	});

	it("should logout correctly", () => {
		localStorage.setItem("authToken", "12345");
		localStorage.setItem("refreshToken", "67890");
		authService.logout();

		expect(localStorage.removeItem).toHaveBeenCalledWith("authToken");
		expect(localStorage.removeItem).toHaveBeenCalledWith("refreshToken");
		expect(localStorage.removeItem).toHaveBeenCalledWith("expires_at");
	});

	it("should getUser correctly", () => {

	});
});
