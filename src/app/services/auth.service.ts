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

interface loginResponse {
	id: string;
	authToken: string;
	refreshToken: string;
}

@Injectable()
export class AuthService {

	private readonly anonym: string = "anonym";
	private userSubject: BehaviorSubject<User>;
	public user$: Observable<User>;

	constructor(private http: HttpClient,
		private router: Router) {
		this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem("user")!));
		this.user$ = this.userSubject.asObservable();
	}

	/**
	 * Creates a new anonymous user if there is no user in the local storage.
	 */
	public get currentUser(): User {
		if (this.userSubject.value === null) {
			this.userSubject.next(new User(this.anonym));
			localStorage.setItem("user", JSON.stringify(this.userSubject.value));
		}
		return this.userSubject.value;
	}

	public set currentUser(user: User) {
		this.userSubject.next(user);
		localStorage.setItem("user", JSON.stringify(user));
	}

	/**
	 * Register a user and log in with the new user. Set new user as current user.
	 */
	public register(user: User): Observable<any> {

		return this.http.post((environment.BACKEND_ITA_SSO_BASE_URL.concat(environment.BACKEND_SSO_REGISTER_URL)),
			{
				'dni': 'user.dni',
				'password': user.password,
				'confirmPassword': user.confirmPassword,
				'email': user.email,
				'itineraryId': user.itineraryId
			},
			{
				headers: {
					'Content-Type': 'application/json'
				}
			});
	}


	/**
	 * Log in with a user. Set user as current user.
	 */
	public login(user: User) {

		this.http.post<loginResponse>(environment.BACKEND_ITA_SSO_BASE_URL.concat(environment.BACKEND_SSO_LOGIN_URL),
			{
				'dni': user.dni,
				'password': user.password
			},
			{
				headers: {
					'Content-Type': 'application/json'
				}
			}).subscribe((resp: loginResponse) => {
				this.currentUser = new User(resp.id);
				localStorage.setItem("authToken", resp.authToken);
				localStorage.setItem("refreshToken", resp.refreshToken);
			});
	}


	public logout() {
		localStorage.removeItem("user");
		localStorage.removeItem("authToken");
		localStorage.removeItem("refreshToken");
		localStorage.removeItem("expires_at");
	}


	/* Get token from LocalStorage if it exists */
	public getTokenFromLocalStorage(tokenType: string) {
		return localStorage.getItem("authToken");
	}

	/* Check if the user is  Logged in*/
	public async isUserLoggedIn() {

		//TODO check if token is expired, if it is i don't send it to the back
		let isUserLoggedIn: boolean = false;
		let token = this.getTokenFromLocalStorage('authToken');
		if (token) {
			let isTokenValid = await this.isTokenValid(token);
			if (isTokenValid) {
				isUserLoggedIn = true;
			} else {
				//TODO check if refresh token is valid
				isUserLoggedIn = await this.isRefreshTokenValid();
			}
		}
		return isUserLoggedIn;
	}

	/* Check refresh token */
	async isRefreshTokenValid() {
		let refreshToken = this.getTokenFromLocalStorage('refreshToken');
		let isRefreshTokenValid: boolean = false;

		if (refreshToken) {
			isRefreshTokenValid = await this.isTokenValid(refreshToken)
			//TODO - check refresh token validity and request login or new token accordingly
		}

		return isRefreshTokenValid;
	}


	/* See if token is valid */
	public isTokenValid(token: string): Promise<boolean> {

		return new Promise<boolean>((reject, resolve) => {

			this.http.post(environment.BACKEND_ITA_SSO_BASE_URL.concat(environment.BACKEND_SSO_VALIDATE_TOKEN_URL),
				{
					"authToken": "string"
				},
				{
					headers: {
						'Content-Type': 'application/json'
					}
				})
				.subscribe({
					next: (resp: any) => {
						if (resp.status == 200) {
							resolve(true);
						} else {
							reject(false);
						}
					},
					error: (err) => { resolve(false) },
				});
		})
	}


}
