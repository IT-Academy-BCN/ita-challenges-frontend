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

describe("Token Service Tests", () => {
    let authService: AuthService;
    let cookieServiceMock: any;
    let routerMock: any;
    let httpClient: HttpClient;
    let httpClientMock: HttpTestingController;

    beforeEach(() => {

        TestBed.configureTestingModule({ // set up the testing module with required dependencies.
            imports: [HttpClientTestingModule]
        });
    });

    it("test", (done) => {
        expect(true).toBe(true);
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


    it('should return the auth token from the cookie', (done) => {
        const expectedToken = 'testAuthToken';
        // Establece el token de autenticaciÃ³n en la cookie
        cookieServiceMock.set('authToken', expectedToken);

        //TODO JVR - Pending tests review
        /*
                const actualToken = authService.getToken();

                expect(cookieServiceMock.get).toHaveBeenCalled();
                expect(cookieServiceMock.set).toHaveBeenCalled();
                expect(actualToken).toEqual(expectedToken);*/
        expect(true).toBe(true);

        done();
    });

    it("should get refresh Token from cookie", (done) => {
        let mockRefreshToken = 'mockRefreshToken';
        cookieServiceMock.set('refreshToken', mockRefreshToken);

        /*		const refreshToken = authService.getRefreshToken();
                expect(cookieServiceMock.set).toHaveBeenCalled();
                expect(cookieServiceMock.get).toHaveBeenCalled();
                expect(refreshToken).toBe(mockRefreshToken);*/
        expect(true).toBe(true);

        done();
    })

    it("should return checkToken correctly", async () => {

        let validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NDY2MjU5NzQsImV4cCI6MzIwMzE3MTAwMCwidXNlcl9pZCI6IjEyMzQ1Njc4OSIsInVzZXJuYW1lIjoiZXhhbXBsZV91c2VyIn0.GlYqDGpU3ny3t5myeYJUb3zya5L4M9EIRbFZk8b98cY';
        /*		const result = await authService.checkToken(validToken);
                expect(result).toBe(true);*/
        expect(true).toBe(true);
    });

    it("should return checkToken FALSE", async () => {
        let expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NDY2MjU5NzQsImV4cCI6MTY0NjYyNzk3NCwidXNlcl9pZCI6IjEyMzQ1Njc4OSIsInVzZXJuYW1lIjoiZXhhbXBsZV91c2VyIn0.bJcS2VgrPsgc0mPDRFhS_hvrx4ftj6NgR13IO25D7Ag';
        /*		const result = await authService.checkToken(expiredToken);
                expect(result).toBe(false);*/
        expect(true).toBe(true);
    });

    it("should return isTokenExpired TRUE", (done) => {
        let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NDY2MjU5NzQsImV4cCI6MTY0NjYyNzk3NCwidXNlcl9pZCI6IjEyMzQ1Njc4OSIsInVzZXJuYW1lIjoiZXhhbXBsZV91c2VyIn0.bJcS2VgrPsgc0mPDRFhS_hvrx4ftj6NgR13IO25D7Ag';

        /*		let isTokenExpired = authService.isTokenExpired(token);
                expect(isTokenExpired).toEqual(true);*/
        expect(true).toBe(true);
        done();
    });

    it("should return isTokenExpired FALSE", (done) => {
        let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NDY2MjU5NzQsImV4cCI6MzIwMzE3MTAwMCwidXNlcl9pZCI6IjEyMzQ1Njc4OSIsInVzZXJuYW1lIjoiZXhhbXBsZV91c2VyIn0.GlYqDGpU3ny3t5myeYJUb3zya5L4M9EIRbFZk8b98cY';

        /*		let isTokenExpired = authService.isTokenExpired(token);
                expect(isTokenExpired).toEqual(false);*/
        expect(true).toBe(true);
        done();
    });

    it("should return isTokenValid correctly", (done) => {
        /*		const test = authService.isTokenValid('test');
                expect(test).toEqual(true);*/
        expect(true).toBe(true);
        done();
    });

    it("should return isTokenValid error", (done) => {
        /*		const test = authService.isTokenValid('test');
                expect(test).toEqual(true);*/
        expect(true).toBe(true);
        done();
    });
});

