import moment from "moment";
import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { environment } from "../../environments/environment";
import {
	BehaviorSubject,
	Observable,
	catchError,
	map,
	tap,
	throwError,
} from "rxjs";
import { User } from "../models/user.model";
import { Router } from "@angular/router";

@Injectable()
export class AuthService {
	// newUser: User | undefined;
	private userSubject: BehaviorSubject<User>;
	public user: Observable<User>;

	/**
	 * Gives us access to the Angular HTTP client so we can make requests to
	 * our Express app
	 */
	constructor(private http: HttpClient, private router: Router) {
		this.userSubject = new BehaviorSubject(
			JSON.parse(localStorage.getItem("user")!)
		);
		this.user = this.userSubject.asObservable();
	}

	public get currentUser(): User {
		return this.userSubject.value;
	}

	/**
	 * Passes the username and password that the user typed into the application
	 * and sends a POST request to our Express server login route, which will
	 * authenticate the credentials and return a JWT token if they are valid
	 *
	 * The `res` object (has our JWT in it) is passed to the setLocalStorage
	 * method below
	 *
	 * shareReplay() documentation - https://www.learnrxjs.io/operators/multicasting/sharereplay.html
	 */
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

		// return this.http.get<any>(`${environment.BACKEND_DUMMY_LOGIN}`).pipe(
		// 	map((authResult: any) => {
		// 		this.setLocalStorage(authResult); // Llama a setLocalStorage con el resultado de autenticación
		// 		console.log("from auth service login ", authResult);
		// 		return authResult; // Devuelve el resultado del registro
		// 	}),
		// 	catchError((error: HttpErrorResponse) => {
		// 		// Maneja el error aquí (muestra un mensaje de error)
		// 		console.log("porque da error", error);
		// 		return throwError(error);
		// 	})
		// );
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
					if (authResult ) {
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
	

	/* register(user: User): Observable<void> {
		  // Agrega el campo itineraryId al objeto user
		  user.itineraryId = environment.ITINERARY_ID;

		console.log("from auth service register 11111", user);
		return this.http
			.post<void>(
				`${environment.BACKEND_ITA_WIKI_BASE_URL}${environment.BACKEND_REGISTER}`,

				user
			)

			.pipe(
				map((authResult: any) => {
					console.log("Response from server:", authResult);
					if (authResult && authResult.expiresIn) {
						this.setLocalStorage(authResult);
						console.log("from auth service register", authResult);
					} else {
						throw new Error("Invalid authentication result");
					}
				}),
				catchError((error: HttpErrorResponse) => {
					console.log("Error during registration", error);
					console.log("Server response:", error.error); // Muestra la respuesta del servidor
					return throwError(error);
				})
			);
	} */

	// Simular la solicitud con datos de un archivo dummy
	/* return this.http
                .get<any>(`${environment.BACKEND_DUMMY_REGISTER}`) 
                .pipe(
                    map((authResult: any) => {
                        this.setLocalStorage(authResult); // Llama a setLocalStorage con el resultado de autenticación
                        console.log('from auth service ', authResult);
						return authResult; // Devuelve el resultado del registro
                    }),
                    catchError((error: HttpErrorResponse) => {
                        // Maneja el error aquí (muestra un mensaje de error)
                        console.log('porque da error', error)
                        return throwError(error);
                    })
                ); */

				private setLocalStorage(authResult: any) {
					if (authResult ) {
						
						// Takes the JWT expiresIn value and add that number of seconds
						// to the current "moment" in time to get an expiry date
						const expiresAt = moment().add(5, "seconds");

						//nota para frontend: el registro nos da codigo 204 y por lo tanto no crea ningun token. por eso hemos quitado la propiedad authResult.expiresIn del registro y del setlocalStograge
				
						// Stores our JWT token and its expiry date in localStorage
						localStorage.setItem("id_token", authResult.idToken);
						localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()));
					} else {
						// Handle the case where expiresIn is not present in authResult
						console.error("Invalid authentication result: expiresIn is missing", authResult);
						// You may choose to throw an error, log a message, or handle it in another way
					}
				}

	// By removing the token from localStorage, we have essentially "lost" our
	// JWT in space and will need to re-authenticate with the Express app to get
	// another one.
	logout() {
		localStorage.removeItem("id_token");
		localStorage.removeItem("expires_at");
	}

	// Returns true as long as the current time is less than the expiry date
	public isLoggedIn() {
		return moment().isBefore(this.getExpiration());
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
