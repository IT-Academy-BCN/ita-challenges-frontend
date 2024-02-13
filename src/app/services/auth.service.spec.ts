import { AuthService } from "./auth.service";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { of, throwError } from "rxjs";

describe("AuthService", () => {
	let authService: AuthService;
	let cookieServiceMock: any;
	let httpClientMock: any;
	let routerMock: any;

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

		// Mock localStorage
		const localStorageMock = (function () {
			let store : any= {};
			return {
				getItem: jest.fn((key) => store[key] || null),
				setItem: jest.fn((key, value) => {
					store[key] = value.toString();
				}),
				removeItem: jest.fn((key) => {
					delete store[key];
				}),
				clear: jest.fn(() => {
					store = {};
				}),
			};
		})();
		Object.defineProperty(window, "localStorage", {
			value: localStorageMock,
		});
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
