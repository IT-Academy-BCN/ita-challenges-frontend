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
		if(this.userSubject.value===null) {
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

}
