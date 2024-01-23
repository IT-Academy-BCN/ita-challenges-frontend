import { add } from "date-fns";
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
		this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem("user")!));

		console.log("*******"+JSON.stringify(this.userSubject));
		this.user = this.userSubject.asObservable();
	}

	public get currentUser(): User {
		return this.userSubject.value;
	}

	public login(dni: string, password: string): Observable<User> {
		return this.http.post<User>(
			`${environment.BACKEND_ITA_SSO_BASE_URL}${environment.BACKEND_SSO_LOGIN}`,
			{ dni, password }
		)
			.pipe(
				map((user) => {
					this.setLocalStorage(user);
					return user;
				}),
				catchError((error: HttpErrorResponse) => {
					return throwError(error);
				})
			);
	}

	public register(user: User): Observable<void> {
		user.itineraryId = environment.ITINERARY_ID;

		return this.http.post<void>(`${environment.BACKEND_ITA_SSO_BASE_URL}${environment.BACKEND_SSO_REGISTER}`,
			user
		)
			.pipe(
				tap((authResult: any) => {
					if (authResult) {
						this.setLocalStorage(authResult);
					} else {
					}
				}),
				catchError((error: HttpErrorResponse) => {
					return throwError(error);
				})
			);
	}

	private setLocalStorage(authResult: any) {
		if (authResult) {
			const expiresAt = add(new Date(), { seconds: 5 });
			localStorage.setItem("authToken", authResult.authToken);
			localStorage.setItem("refreshToken", authResult.refreshToken);
			localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()));
		} else {
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
		const token = localStorage.getItem("authToken") ?? "";
		const refreshToken = localStorage.getItem("refreshToken");

		if (!token && !refreshToken) {
			return of(false);
		}

		if (token && refreshToken) {
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
					if (!isValid) {
						this.logout();
					}
					return isValid;
				}),
				catchError((error) => {
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
		return expiration != null ? JSON.parse(expiration) : null;
	}
}
