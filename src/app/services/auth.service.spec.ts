import moment from "moment";
import { AuthService } from "./auth.service";
import { of, throwError } from "rxjs";
import { TestScheduler } from "rxjs/testing";

// Mocking the dependencies: HttpClient and Router
jest.mock("@angular/common/http", () => ({
	HttpClient: jest.fn().mockImplementation(() => ({
		get: jest.fn(),
	})),
}));
jest.mock("@angular/router", () => ({
	Router: jest.fn().mockImplementation(() => ({
		navigate: jest.fn(),
	})),
}));

describe("AuthService", () => {
	let authService: AuthService;
	let httpClientMock: any;
	let routerMock: any;
	let testScheduler: TestScheduler;

	beforeEach(() => {
		// Since HttpClient and Router are now mocked, we can require them here
		const { HttpClient } = require("@angular/common/http");
		const { Router } = require("@angular/router");

		// Initialize the mocks
		httpClientMock = new HttpClient();
		routerMock = new Router();

		// Mock the local storage methods
		Object.defineProperty(window, "localStorage", {
			value: {
				setItem: jest.fn(),
				getItem: jest.fn().mockReturnValue(null), // Default to 'null' to simulate empty local storage
				removeItem: jest.fn(),
			},
			writable: true,
		});

		// Create the AuthService instance with the mocked HttpClient and Router
		authService = new AuthService(httpClientMock, routerMock);

		// Create a new TestScheduler for each test
		testScheduler = new TestScheduler((actual, expected) => {
			expect(actual).toEqual(expected);
		});
	});

	it("should simulate a successful registration", () => {
		// Dummy user data that we expect to register
		const dummyUser = {
			dni: "01875580E",
			email: "julia123@gmail.cat",
			password: "test123",
			confirmPassword: "test123",
			specialization: "cln1fjzif000008mdcsfq64c2",
			name: "olivia",
			accept: true,
			token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
		};

		// Set up the HttpClient mock to return our dummy user data when get is called
		httpClientMock.get.mockReturnValue(of(dummyUser));

		testScheduler.run(({ expectObservable }) => {
			// Marble diagram representing the expected observable stream
			const expectedMarble = "(a|)"; // Emission 'a' followed by completion '|'
			// Values that the 'a' in the marble diagram represents
			const expectedValues = { a: dummyUser };

			// Call the register method, which returns an Observable
			const obs$ = authService.register(dummyUser);

			// Assert that the observable behaves as expected
			expectObservable(obs$).toBe(expectedMarble, expectedValues);
		});

		// Check that localStorage.setItem was called (if your service does that upon registration)
		expect(localStorage.setItem).toHaveBeenCalled();
	});

	it("should return true if the user is logged in", () => {
		// Simular que el usuario está conectado
		const expiresAt = moment().add(1, "hour").valueOf(); // Configura un tiempo de expiración válido en el futuro
		(localStorage.getItem as jest.Mock).mockReturnValue(
			JSON.stringify(expiresAt)
		);

		const result = authService.isLoggedIn();
		expect(result).toBeTruthy();
	});

	it("should return false if the user is logged out", () => {
		// Simular que el usuario está desconectado
		const expiresAt = moment().subtract(1, "hour").valueOf(); // Configura un tiempo de expiración en el pasado
		(localStorage.getItem as jest.Mock).mockReturnValue(
			JSON.stringify(expiresAt)
		);

		const result = authService.isLoggedOut();
		expect(result).toBeTruthy();
	});

	it("should return the expiration time", () => {
		// Simular un tiempo de expiración específico en el almacenamiento local
		const expiresAt = moment().add(1, "hour").valueOf(); // Configura un tiempo de expiración en el futuro
		(localStorage.getItem as jest.Mock).mockReturnValue(
			JSON.stringify(expiresAt)
		);

		const result = authService.getExpiration();
		expect(result).toBeTruthy();
	});

	// ... (El resto de tu archivo de prueba aquí)

	it("should simulate a successful login", () => {
		// Datos de usuario ficticios que esperamos recibir después de un login exitoso
		const dummyUser = {
			dni: "12345678D",
			token: "fake-jwt-token",
		};

		// Configurar el HttpClient mock para devolver nuestros datos de usuario ficticios cuando se llama a get
		httpClientMock.get.mockReturnValue(of(dummyUser));

		testScheduler.run(({ expectObservable }) => {
			// Diagrama de mármol representando la secuencia esperada del observable
			const expectedMarble = "(a|)"; // Emisión 'a' seguida de la conclusión '|'
			// Valores que representa el 'a' en el diagrama de mármol
			const expectedValues = { a: dummyUser };

			// Llamada al método login, que devuelve un Observable
			const obs$ = authService.login("12345678D", "password");

			// Afirmar que el observable se comporta como se espera
			expectObservable(obs$).toBe(expectedMarble, expectedValues);
		});

		// Verificar que se llamó a setLocalStorage (si tu servicio hace eso tras el login)
		expect(localStorage.setItem).toHaveBeenCalled();
	});

	it("should handle login error", () => {
		// Simular un error de HttpClient
		const errorResponse = new Error("Error de autenticación");

		// Configurar el HttpClient mock para lanzar un error cuando se llama a get
		httpClientMock.get.mockReturnValue(throwError(() => errorResponse));

		testScheduler.run(({ expectObservable }) => {
			// Diagrama de mármol representando la secuencia esperada del observable
			const expectedMarble = "#"; // Emisión de error

			// Llamada al método login, que devuelve un Observable
			const obs$ = authService.login("12345678D", "password");

			// Afirmar que el observable se comporta como se espera
			expectObservable(obs$).toBe(expectedMarble, null, errorResponse);
		});
	});

	// ... (El resto de tus casos de prueba aquí)

	// Add more test cases as needed
});
