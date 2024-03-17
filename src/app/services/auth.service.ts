import { add } from "date-fns";
import { AbstractType, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import {
	BehaviorSubject,
	Observable,
	catchError,
	firstValueFrom,
	map,
	of,
	tap,
	throwError,
} from "rxjs";
import { User } from "../models/user.model";
import { ResolveEnd, Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { fakeAsync } from '@angular/core/testing';
import { BlobOptions } from "buffer";
import { TokenService } from "./token.service";
import { error } from "console";
import { resolve } from "path";


interface loginResponse {
	id: string;
	authToken: string;
	refreshToken: string;
}

interface registerResponse {
	id: string;
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
		private cookieService: CookieService,
		private tokenService: TokenService) {

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
	public registerRequest(user: User): Observable<any> {

		return this.http.post((environment.BACKEND_ITA_SSO_BASE_URL.concat(environment.BACKEND_SSO_REGISTER_URL)),
			{
				'dni': user.dni,
				'email': user.email,
				'name': user.name,
				'itineraryId': user.itineraryId,
				'password': user.password,
				'confirmPassword': user.confirmPassword,
			},
			{
				headers: {
					'Content-Type': 'application/json'
				}
			})
	}

	public register(user: User): Promise<any> {
		return new Promise((resolve, reject) => {
			this.registerRequest(user).subscribe({
				next: (resp: registerResponse) => {
					resolve(null);
					this.modifyUserWithAdmin(resp.id);
				},
				error: (err) => { reject(err.message) }
			});
		});
	}

	public async modifyUserWithAdmin(registerUserId: string) {
		const userAdmin = { //todo: need to improve the security and a real ADMIN account
			'idUser': '',
			'dni': '32983483B',
			'password': 'rU2GiuiTf3oj2RvQjMQX8EyozA7k2ehTp8YIUGSWOL3TdZcn7jaq7vG8z5ovfo6NMr77'
		}
		await this.login(userAdmin);
		try {
			let userLoggedData = await this.getLoggedUserData();
			if (userLoggedData.role === 'ADMIN') {
				await firstValueFrom(
					this.http.patch((environment.BACKEND_ITA_SSO_BASE_URL.concat(environment.BACKEND_SSO_PATCH_USER).concat(`?id=${registerUserId}`)),
						{
							'authToken': this.cookieService.get('authToken'),
							'status': 'ACTIVE',
						},
						{
							headers: {
								'Content-Type': 'application/json',
							}
						})
				);
			} else {
				throw new Error("The logged-in user is not an admin.");
			}
			this.logout;
		} catch (error) {
			console.error("Error modifying user with admin:", error);
			throw error;
		}
	}

	public getUserIdFromCookie() {
		let stringifiedUSer = this.cookieService.get('user');
		let user = JSON.parse(stringifiedUSer);
		return user.idUser;
	}

	/**
	 * Log in with a user. Set user as current user.
	 */
	public loginRequest(user: User): Observable<loginResponse> {
		return this.http.post<loginResponse>(environment.BACKEND_ITA_SSO_BASE_URL.concat(environment.BACKEND_SSO_LOGIN_URL),
			{
				'dni': user.dni,
				'password': user.password
			},
			{
				headers: {
					'Content-Type': 'application/json'
				}
			});
	}

	public async login(user: User): Promise<any> {
		try {
			let resp = await this.loginRequest(user).toPromise();
			if (!resp) {
				throw new Error("Empty response");
			}
			this.currentUser = new User(resp.id);
			this.cookieService.set('authToken', resp.authToken);
			this.cookieService.set('refreshToken', resp.refreshToken);
			this.cookieService.set('user', JSON.stringify(this.currentUser));
			return resp;
		} catch (err) {
			throw err;
		}
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

	public getLoggedUserData(): Promise<UserResponse> {
		return new Promise<UserResponse>((resolve, reject) => {
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
					resolve(res);
				},
				error: err => { reject(err.message) }
			})
		});
	}

	/* Check if the user is  Logged in*/
	public async isUserLoggedIn() { //TODO: neec tokenService first
		// let isUserLoggedIn: boolean = false;
		// let authToken = this.cookieService.get('authToken');
		// let authTokenValid = await this.checkToken(authToken);
		// if (authTokenValid) {
		// 	isUserLoggedIn = true;
		// } else {
		// 	let refreshToken = this.cookieService.get('authToken');
		// 	isUserLoggedIn = await this.checkToken(refreshToken);
		// }
		// return isUserLoggedIn;
	}

	/* return if token valid */
	async checkToken(token: string): Promise<boolean> {

		return true;
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


