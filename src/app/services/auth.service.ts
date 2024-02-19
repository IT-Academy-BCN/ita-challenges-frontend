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
		return true;
	}

	public getRefreshToken() {
		return true;
	}

	public getUserIdFromCookie() {
		return true;
	}

	/**
	 * Log in with a user. Set user as current user.
	 */
	public login() {//todo: recibe => user:User
		return true;
	}

	public logout() {
		return true;
	}

	/**
		 * get User Data 
		 * and store it in the cookie
	*/
	
	public getLoggedUserData() {
		return true;
	}

	/* Check if the user is  Logged in*/
	public async isUserLoggedIn() {
		return true;
	}

	/* return if token valid */
	async checkToken(token: string): Promise<boolean> {

		return true;
	}

	// Check if the token is expired
	public isTokenExpired(token: string): boolean {
		return true;
	}

	/* See if token is valid */
	public isTokenValid(token: string): boolean { //todo: Promise<boolean>
		return true;
	}
}


