import { AuthService } from "./auth.service";
import { TestScheduler } from "rxjs/testing";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { of } from "rxjs";

describe("AuthService", () => {
	let authService: AuthService;
	let httpClientMock: any;
	let routerMock: any;
	let testScheduler: TestScheduler;

	beforeEach(() => {
		httpClientMock = jasmine.createSpyObj("HttpClient", ["get"]);
        
		routerMock = jasmine.createSpyObj("Router", ["navigate"]);

		// Mocking local storage
		spyOn(localStorage, "setItem");
		spyOn(localStorage, "getItem").and.returnValue(null);

		authService = new AuthService(httpClientMock, routerMock);

		testScheduler = new TestScheduler((actual, expected) => {
			expect(actual).toEqual(expected);
		});
	});

	it("should simulate a successful registration", () => {
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

		httpClientMock.get.and.returnValue(of(dummyUser));

		testScheduler.run(({ expectObservable }) => {
			const expectedMarble = "a"; // Use the appropriate marble diagram
			const expectedValues = { a: dummyUser };

			const obs$ = authService.register(dummyUser);

			expectObservable(obs$).toBe(expectedMarble, expectedValues);
		});

		// You can also expect that setLocalStorage was called if necessary
		expect(localStorage.setItem).toHaveBeenCalled();
	});

	// Add more test cases as needed
});
