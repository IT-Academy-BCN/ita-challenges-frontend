import moment from "moment";
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
		this.userSubject = new BehaviorSubject(
			JSON.parse(localStorage.getItem("user")!)
		);
		this.user = this.userSubject.asObservable();
	}

	public get currentUser(): User {
		return this.userSubject.value;
	}

	login(dni: string, password: string): Observable<User> {
		return this.http
			.post<User>(
				`${environment.BACKEND_ITA_WIKI_BASE_URL}${environment.BACKEND_LOGIN}`,
				{ dni, password }
			)
			.pipe(
				map((user) => {
					console.log(user);
					this.setLocalStorage(user);
					return user;
				})
			); 
	}

	register(user: User): Observable<void> {
		user.itineraryId = environment.ITINERARY_ID;

		return this.http
			.post<void>(
				`${environment.BACKEND_ITA_WIKI_BASE_URL}${environment.BACKEND_REGISTER}`,
				user
			)
			.pipe(
				tap((authResult: any) => {
					// Si hay datos (no es un 204), procesa el resultado
					if (authResult) {
						this.setLocalStorage(authResult);
					} else {
						// Si es un 204, simplemente notifica que el registro fue exitoso
						console.log("Registration successful");
					}
				}),
				catchError((error: HttpErrorResponse) => {
					console.log("Error during registration", error);
					console.log("Server response:", error.error); // Muestra la respuesta del servidor
					return throwError(error);
				})
			);
	}


	private setLocalStorage(authResult: any) {
		if (authResult) {
			console.log(authResult, '******************************')
			// Takes the JWT expiresIn value and add that number of seconds
			// to the current "moment" in time to get an expiry date
			const expiresAt = moment().add(5, "seconds");

			//nota para frontend: el registro nos da codigo 204 y por lo tanto no crea ningun token. por eso hemos quitado la propiedad authResult.expiresIn del registro y del setlocalStograge

			// Stores our JWT token and its expiry date in localStorage
			localStorage.setItem("authToken", authResult.authToken);
			localStorage.setItem("refreshToken", authResult.refreshToken);

			// console.log("authToken", authResult.authToken);
			localStorage.setItem(
				"expires_at",
				JSON.stringify(expiresAt.valueOf())
			);

		} else {
			// Handle the case where expiresIn is not present in authResult
			console.error(
				"Invalid authentication result: expiresIn is missing",
				authResult
			);
			// You may choose to throw an error, log a message, or handle it in another way
		}
		this.isLoggedIn();
	}

	// By removing the token from localStorage, we have essentially "lost" our
	// JWT in space and will need to re-authenticate with the Express app to get
	// another one.
	logout() {
		localStorage.removeItem("authToken");
		localStorage.removeItem("refreshToken");
		localStorage.removeItem("expires_at");
	}

	// Returns true as long as the current time is less than the expiry date
	public isLoggedIn(): Observable<boolean> {
		console.log('Checking if user is logged in');

		// const expiration = localStorage.getItem("refreshToken");
		// const expiresAt = JSON.parse(expiration || "null");

		const token = localStorage.getItem("authToken");
		const refreshToken = localStorage.getItem("refreshToken");

		console.log('refreshToken:', refreshToken);

		// if (!refreshToken) {
		// 	console.log('Token has expired, logging out');
			//  Programa la expiración del token después de 10 segundos. 
			// Este fragmento de código utiliza setTimeout para programar la expiración del token almacenado en localStorage después de 10 segundos, desencadenando automáticamente la función de logout.
			//  setTimeout(() => {
			// 	console.log('Token expired after 10 seconds');
			// 	this.logout(); // Llama a la función de logout cuando el token expire
			// }, 10000); // 10,000 milisegundos es igual a 30 segundos
			// this.logout(); // Si el token ha expirado según la caducidad local, realiza el logout
			// return of(false);
		// }

		

		if (!token && !refreshToken) {
			console.log('No token found, user is not logged in');
			return of(false); // Si no hay token, retorna false
		}

		console.log('Token found, validating token with server');

		// Hacer la llamada al endpoint para validar el token
		return this.http
			.post<boolean>(
				"https://dev.sso.itawiki.eurecatacademy.org/api/v1/tokens/validate",
				{ token }
			)
			.pipe(
				map((isValid) => {
					console.log('Token validation result:', isValid);
					if (!isValid) {
						this.logout(); // Si el token no es válido según el servidor, realiza el logout
					}
					return isValid;
				}),
				catchError((error) => {
					console.error('Error validating token:', error);
					this.logout();
					return of(false); // En caso de error, asume que el token no es válido y realiza el logout
				})
			);
	}


	isLoggedOut() {
		return !this.isLoggedIn();
	}

	getExpiration() {
		const expiration = localStorage.getItem("expires_at");
		const expiresAt = expiration != null ? JSON.parse(expiration) : "";
		return moment(expiresAt);
	}
}

