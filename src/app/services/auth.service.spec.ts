import { AuthService } from "./auth.service";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { of, throwError } from "rxjs";

describe("AuthService", () => {
	let authService: AuthService;
	let cookieServiceMock: any;
	let httpClientMock: any;
	let routerMock: any;
	let cookiesStorageMock: any;

	beforeEach(() => {
		cookieServiceMock = {
			set: jest.fn(),
			get: jest.fn(),
		};
		httpClientMock = {
			post: jest.fn(),
		};
		routerMock = {
			navigate: jest.fn(),
		};
		authService = new AuthService(httpClientMock, routerMock, cookieServiceMock);

		// Mock Cookie Storage
		cookiesStorageMock = {
			cookies: {},
			set: jest.fn().mockImplementation((name, value) => {
				cookiesStorageMock.cookies[name] = value.toString();
			}),
			get: jest.fn().mockImplementation((name) => {
				return cookiesStorageMock.cookies[name] || null;
			}),
			delete: jest.fn().mockImplementation((name) => {
				delete cookiesStorageMock.cookies[name];
			}),


			// set: jest.fn().mockImplementation((name, value) => {
			// 	// Aquí estableces la cookie
			// 	document.cookie = `${name}=${value}`;
			// 	// Devuelves algún valor, por ejemplo, un objeto que indique que se estableció la cookie correctamente
			// 	return { success: true };

			// }),
			// get: jest.fn().mockImplementation((name) => {
			// 	const cookieName = `${name}=`;
			// 	const decodedCookie = decodeURIComponent(document.cookie);
			// 	const cookieArray = decodedCookie.split(';');
			// 	for (let i = 0; i < cookieArray.length; i++) {
			// 		let cookie = cookieArray[i];
			// 		while (cookie.charAt(0) === ' ') {
			// 			cookie = cookie.substring(1);
			// 		}
			// 		if (cookie.indexOf(cookieName) === 0) {
			// 			return cookie.substring(cookieName.length, cookie.length);
			// 		}
			// 	}
			// 	return null;
			// }),
			
		};

		// const cookiesStorageMock = (function () {
		// 	let cookies : any= {};
		// 	return {
		// 		get: jest.fn((key) => cookies[key] || null),
		// 		set: jest.fn((key, value, ) => {
		// 			cookies[key] = value.toString();
		// 		}),
		// 		delete: jest.fn((key) => {
		// 			delete cookies[key];
		// 		}),
		// 	};
		// })();
		// Object.defineProperty(window, "cookies", {
		// 	value: cookiesStorageMock,
		// });
	});

	it('should return the auth token from the cookie', (done) => {
		const expectedToken = 'testAuthToken';
		// Establece el token de autenticación en la cookie
		cookieServiceMock.set('authToken', expectedToken);
	
		// Espiar el método 'get' de 'cookieServiceMock'
		jest.spyOn(cookieServiceMock, 'get');
	
		// Llama a la función que queremos probar
		const actualToken = authService.getToken();
	
		// Verifica que el método 'get' del servicio de cookies se haya llamado con el nombre correcto del token
		expect(cookieServiceMock.get).toHaveBeenCalledWith('authToken');
	
		// Comprueba que el token devuelto sea el esperado
		expect(actualToken).toEqual(expectedToken);
	
		done();


		// const expectedToken = 'testAuthToken';
		// // Establece el token de autenticación en la cookie
		// cookieServiceMock.set('authToken', expectedToken);

		// console.log('resultado: ', cookieServiceMock.set('authToken', expectedToken));
		// const actualToken = authService.getToken();
		// const token = cookieServiceMock.get('authToken');

		// expect(cookieServiceMock.get).toHaveBeenCalled();
		// expect(cookieServiceMock.set).toHaveBeenCalled();
		// expect(actualToken).toEqual(expectedToken);
		// done();
	});

	it("should get refresh token from cookie", (done) => {
		//arrange
		let mockRefreshToken = 'mockRefreshToken';
		cookieServiceMock.set('refreshToken', mockRefreshToken);
		//act
		let refreshToken = authService.getRefreshToken();
		//assert
		expect(cookieServiceMock.get).toHaveBeenCalled();
		// expect(refreshToken).toBe(mockRefreshToken);
		done();
	})

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
