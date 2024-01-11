import moment from "moment";
import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { environment } from "../../environments/environment";
import {
	BehaviorSubject,
	Observable,
	catchError,
	map,
	of,
	tap,
	throwError,
} from "rxjs";
import { User } from "../models/user.model";
import { Router } from "@angular/router";

@Injectable()
export class AuthService {
	private userSubject: BehaviorSubject<User>;
	public user: Observable<User>;

	constructor(private http: HttpClient, private router: Router) {
		this.userSubject = new BehaviorSubject(
			JSON.parse(localStorage.getItem("user")!)
		);
		this.user = this.userSubject.asObservable();
	}

	public get currentUser(): User {
		return this.userSubject.value;
	}

	public login(dni: string, password: string): Observable<User> {
		return this.http
			.post<User>(
				`${environment.BACKEND_ITA_WIKI_BASE_URL}${environment.BACKEND_LOGIN}`,
				{ dni, password }
			)
			.pipe(
				map((user) => {
					console.log(user);
					this.setLocalStorage(user);
					return user;
				}),
				catchError((error: HttpErrorResponse) => {
					console.log("Error during login", error);
					console.log("Server response:", error.error);
					return throwError(error);
				})
			);
	}

	public register(user: User): Observable<void> {
		user.itineraryId = environment.ITINERARY_ID;

		return this.http
			.post<void>(
				`${environment.BACKEND_ITA_WIKI_BASE_URL}${environment.BACKEND_REGISTER}`,
				user
			)
			.pipe(
				tap((authResult: any) => {
					if (authResult) {
						this.setLocalStorage(authResult);
					} else {
						console.log("Registration successful");
					}
				}),
				catchError((error: HttpErrorResponse) => {
					console.log("Error during registration", error);
					console.log("Server response:", error.error);
					return throwError(error);
				})
			);
	}

	private setLocalStorage(authResult: any) {
		if (authResult) {
			console.log(authResult, "******************************");
			const expiresAt = moment().add(5, "seconds");

			localStorage.setItem("authToken", authResult.authToken);
			localStorage.setItem("refreshToken", authResult.refreshToken);
			localStorage.setItem(
				"expires_at",
				JSON.stringify(expiresAt.valueOf())
			);
		} else {
			console.error(
				"Invalid authentication result: expiresIn is missing",
				authResult
			);
			throw new Error("Invalid authentication result: no data found");
		}
		this.isLoggedIn();
	}

	public logout() {
		localStorage.removeItem("authToken");
		localStorage.removeItem("refreshToken");
		localStorage.removeItem("expires_at");
	}

	public isLoggedIn(): Observable<boolean> {
		console.log("Checking if user is logged in");
		const token = localStorage.getItem("authToken") ?? "";
		const refreshToken = localStorage.getItem("refreshToken");

		console.log("refreshToken:", refreshToken);

		if (!token && !refreshToken) {
			console.log("No token found, user is not logged in");
			return of(false);
		}

		if (token && refreshToken) {
			console.log("Token found, validating token with server");
		}

		return this.validateTokenOnServer(token);
	}

	private validateTokenOnServer(token: string): Observable<boolean> {
		return this.http
			.post<boolean>(
				"https://dev.sso.itawiki.eurecatacademy.org/api/v1/tokens/validate",
				{ token }
			)
			.pipe(
				map((isValid) => {
					console.log("Token validation result:", isValid);
					if (!isValid) {
						this.logout();
					}
					return isValid;
				}),
				catchError((error) => {
					console.error("Error validating token:", error);
					this.logout();
					return of(false);
				})
			);
	}

	public isLoggedOut() {
		return !this.isLoggedIn();
	}

	public getExpiration() {
		const expiration = localStorage.getItem("expires_at");
		const expiresAt = expiration != null ? JSON.parse(expiration) : null;
		console.log(expiresAt);
		return moment(expiresAt);
	}
}
