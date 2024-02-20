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
import { fakeAsync } from '@angular/core/testing';
import { BlobOptions } from "buffer";


interface loginResponse {
	id: string;
	authToken: string;
	refreshToken: string;
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

		// Verificar si la cookie 'user' está definida
		const userCookie = this.cookieService.get('user');
		const initialUser = userCookie ? JSON.parse(userCookie) : null;

		this.userSubject = new BehaviorSubject(initialUser);
		this.user$ = this.userSubject.asObservable();
		// this.userSubject = new BehaviorSubject(JSON.parse(this.cookieService.get('user')));
		// this.user$ = this.userSubject.asObservable();
	}

	/**
	 * Creates a new anonymous user if there is no user in the cookies.
	 */
	public get currentUser(): User {
		if (this.userSubject.value === null) {
			this.userSubject.next(new User(this.anonym));
			this.cookieService.set('user', this.anonym);
		}
		return this.userSubject.value;
	}

	public set currentUser(user: User) {
		this.userSubject.next(user);
		this.cookieService.set('user', JSON.stringify(user));
	}

	/**
	 * Register a user and log in with the new user. Set new user as current user.
	 */
	public register(): boolean { //todo: Observavble<any>  y recibe user:User
		return true;
	}

	public getToken() {
		return this.cookieService.get('authToken');
	}

	public getRefreshToken() {
		return this.cookieService.get('refreshToken')
	}

	public getUserIdFromCookie() {
		let stringifiedUSer = this.cookieService.get('user');
		let user = JSON.parse(stringifiedUSer);
		return user.idUser;
	}

	/**
	 * Log in with a user. Set user as current user.
	 */
	public loginRequest(user: User): Observable<any> {
		return this.http.post<loginResponse>(environment.BACKEND_ITA_SSO_BASE_URL.concat(environment.BACKEND_SSO_LOGIN_URL),
			{
				'dni': user.dni,
				'password': user.password
			},
			{
				headers: {
					'Content-Type': 'application/json'
				}
			})
	}

	public logout() {
		this.cookieService.delete('authToken');
		this.cookieService.delete('refreshToken');
		this.cookieService.delete('user');
		this.currentUser;
		this.router.navigate(['/login']);
	}
	/**
		 * get User Data 
		 * and store it in the cookie
	*/

	public getLoggedUserData() {
		this.http.post<UserResponse>(environment.BACKEND_ITA_SSO_BASE_URL.concat(environment.BACKEND_SSO_POST_USER),
			{
				'authToken': this.cookieService.get('authToken'),
			},
		).subscribe({
			next: (res) => {
				let user: User = this.currentUser;
				
				let userData: User = {
					'idUser': user.idUser,
					'dni': res.dni,
					'email': res.email,
				};

				this.currentUser = userData;
			},
			error: err => { console.error(err) }
		})
	}

	/* Check if the user is  Logged in*/
	public async isUserLoggedIn() {
		return true;
	}

	/* return if token valid */
	async checkToken(token: string): Promise<boolean> {
		if (token) {
			let isTokenExpired = this.isTokenExpired(token);
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
	public isTokenExpired(token: string): boolean {
		const expiry = JSON.parse(atob(token.split('.')[1])).exp;
		return Math.floor(new Date().getTime() / 1000) >= expiry;
	}
	/* See if token is valid */
	public isTokenValid(token: string): boolean { //todo: Promise<boolean>
		return true;
	}
}


