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
});

