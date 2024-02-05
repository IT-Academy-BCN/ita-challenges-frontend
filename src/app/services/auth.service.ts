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
import {CookieService} from "ngx-cookie-service";


interface loginResponse {
	id: string;
	authToken: string;
	refreshToken: string;
	expiresAt: string;
}

@Injectable()
export class AuthService {

	private readonly anonym: string = "anonym";
	private userSubject: BehaviorSubject<User>;
	public user$: Observable<User>;

	constructor(private http: HttpClient,
				private router: Router,
				private cookieService: CookieService) {
		this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem("user")!));//TODO - use cookies instead local storage
		this.user$ = this.userSubject.asObservable();
	}

	/**
	 * Creates a new anonymous user if there is no user in the local storage.
	 */
	public get currentUser(): User {
		if(this.userSubject.value===null) {
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
	public register(user:User): Observable<any>{

		return this.http.post((environment.BACKEND_ITA_SSO_BASE_URL.concat(environment.BACKEND_SSO_REGISTER_URL)),
			{
				'dni': 'user.dni',
				'password': user.password,
				'confirmPassword':user.confirmPassword,
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
	public login(user:User) {

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

}
