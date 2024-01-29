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

	private readonly anonym: string = "anonym";
	private userSubject: BehaviorSubject<User>;
	public user: Observable<User>;

	constructor(private http: HttpClient, private router: Router) {
		this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem("user")!));
		this.user = this.userSubject.asObservable();
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

	/**
	 * Register a user and log in with the new user. Set new user as current user.
	 */
	public register(dni: string, email:string, password: string, confirmPassword:string){


	}

	/**
	 * Log in with a user. Set user as current user.
	 */
	public login(dni: string, password: string) {

	}


	public logout() {
		localStorage.removeItem("user");
		localStorage.removeItem("authToken");
		localStorage.removeItem("refreshToken");
		localStorage.removeItem("expires_at");
	}

}
