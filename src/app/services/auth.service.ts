import { add } from "date-fns";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
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
import { CookieService } from "ngx-cookie-service";


interface loginResponse {
	id: string;
	authToken: string;
	refreshToken: string;
	expiresAt: string;
}

interface UserResponse {
	dni: string,
	email: string,
	role: string
}


@Injectable()
export class AuthService {

	private readonly anonym: string = "anonym";
	private userSubject: BehaviorSubject<User>;
	public user$: Observable<User>;

	constructor(private http: HttpClient,
		private router: Router,
		private cookieService: CookieService) {
		this.userSubject = new BehaviorSubject(JSON.parse(this.cookieService.get('user')));
		this.user$ = this.userSubject.asObservable();

	}

	/**
	 * Creates a new anonymous user if there is no user in the cookies.
	 */
	public get currentUser(): User {
		if (this.userSubject.value === null) {
			this.userSubject.next(new User(this.anonym));
			this.cookieService.set('id_user', this.anonym);
		}
		return this.userSubject.value;
	}

	public set currentUser(user: User) {
		this.userSubject.next(user);
		this.cookieService.set('id_user', user.idUser);
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

	public getToken() {
		return this.cookieService.get('authToken');
	}

	public getRefreshToken() {
		return this.cookieService.get('refreshToken');
	}

	public getExpiresAt() {
		return this.cookieService.get('expires_at');
	}

	public getIdUser() {
		return this.cookieService.get('id');
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
				this.cookieService.set('authToken', resp.authToken);
				this.cookieService.set('refreshToken', resp.refreshToken);
				this.cookieService.set('expires_at', resp.expiresAt);
				this.cookieService.set('id_user', resp.id);
			});
	}


	public logout() {
		this.cookieService.delete('authToken');
		this.cookieService.delete('refreshToken');
		this.cookieService.delete('expires_at');
		this.cookieService.delete('id_user');
		this.currentUser = new User(this.anonym);
		this.router.navigate(['/login']);
	}


	/**
		 * get User Data  and store it in the cookie
		 */
	public getUser() {
		this.http.post<UserResponse>(environment.BACKEND_ITA_SSO_BASE_URL.concat(environment.BACKEND_SSO_GET_USER),
			{
				'authToken': this.cookieService.get('authToken'),
			},
		).subscribe({
			next: (res) => {
				let user: User = {
					'idUser': this.cookieService.get('id_user'),
					'dni': res.dni,
					'email': res.email,
				}
				this.cookieService.set('user', JSON.stringify(user))
				this.userSubject.next(user)
			},
			error: err => { console.error(err) }
		})
	}

	/* Check if the user is  Logged in*/
	public async isUserLoggedIn() {
		let isUserLoggedIn: boolean = false;
		let authToken = this.cookieService.get('authToken');
		let authTokenValid = await this.checkToken(authToken);
		if (authTokenValid) {
			isUserLoggedIn = true;
		} else {
			let refreshToken = this.cookieService.get('authToken');
			isUserLoggedIn = await this.checkToken(refreshToken);
		}
		return isUserLoggedIn;
	}

	/* return if token valid */
	async checkToken(token: string): Promise<boolean> {
		if (token) {
			let isTokenExpired = this.tokenExpired(token);
			if (!isTokenExpired) {
				let isTokenValid = this.isTokenValid(token);
				if (await isTokenValid) {
					return true;
				}
			}
		}
		return false;
	}

	// Check if the token is expired
	private tokenExpired(token: string) {
		const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
		return (Math.floor((new Date).getTime() / 1000)) >= expiry;
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

