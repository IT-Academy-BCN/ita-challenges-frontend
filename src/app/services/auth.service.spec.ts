import { AuthService } from "./auth.service";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { addYears } from "date-fns";
import { CookieService } from "ngx-cookie-service";
import { mock } from "node:test";
import { of, throwError } from "rxjs";

describe("AuthService", () => {
	let authService: AuthService;
	let cookieServiceMock: any;
	let httpClientMock: any;
	let routerMock: any;

	beforeEach(() => {
		httpClientMock = {
			post: jest.fn(),
		};
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

		authService = new AuthService(httpClientMock, routerMock, cookieServiceMock);

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
		authService.currentUser = mockUser

		const user = authService.currentUser;

		expect(user).toBeDefined();
		expect(user).toBe(mockUser);
		expect(cookieServiceMock.get).toHaveBeenCalledWith('user');

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
		const mockUser = { authToken: "12345", refreshToken: "67890" };
		httpClientMock.post.mockReturnValue(of(mockUser));

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
		httpClientMock.post.mockReturnValue(throwError(() => new Error(error)));

		/*		authService.login("username", "password").subscribe({
					next: () => {},
					error: (e) => {
						expect(e.message).toBe(error);
						done();
					},
				});*/
	});

	it("should register successfully", (done) => {
		const mockUser = { authToken: "12345", refreshToken: "67890" };
		httpClientMock.post.mockReturnValue(of(mockUser));

		/*		authService
					.register({ dni: "123", password: "password" } as any)
					.subscribe(() => {
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

	it("should handle registration error", (done) => {
		const error = "Registration failed";
		httpClientMock.post.mockReturnValue(throwError(() => new Error(error)));

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

	it("should getUser correctly", () => {
	});


});
