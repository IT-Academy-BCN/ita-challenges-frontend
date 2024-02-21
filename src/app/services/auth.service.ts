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
import { TokenService } from "./token.service";


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
	/*
	    Cookies:
	    - 'user' -> User
	    - 'authToken' -> string
	    - 'refreshToken' -> string
	 */
	constructor(private http: HttpClient,
				private router: Router,
				private cookieService: CookieService,
				private tokenService: TokenService) {

		const user:User = new User(this.cookieService.get('user'));
		this.userSubject = new BehaviorSubject(user);
		this.user$ = this.userSubject.asObservable();
	}

	/**
	 * Get the current user.
	 */
	public get currentUser(): User {
		return this.userSubject.value;
	}

	/**
	 * Set the current user.
	 */
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
					if(resp){
						alert('Success register, wait for the account validation'); //todo: change to modal
						// //TODO: Pasar el id del resp al back para que el admin cambie el "Accept" a true, o status "Activate";
						// this.modifyUserWithAdmin(resp.id);
					}
				},
				error: (err) => { reject(err.message)}
			});
		});
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

		public login(user: User): Promise<any> {
            return new Promise((resolve, reject) => {
                this.loginRequest(user).subscribe({
                    next: (resp: loginResponse) => {
                        this.currentUser = new User(resp.id);
                        this.cookieService.set('authToken', resp.authToken);
                        this.cookieService.set('refreshToken', resp.refreshToken);
                        this.cookieService.set('user', JSON.stringify(this.currentUser));
                        resolve(null);
                    },
                    error: (err) => { reject(err.message) },
                })
            });
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

}


