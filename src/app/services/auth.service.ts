import moment from "moment";
import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable, catchError, map, throwError } from "rxjs";
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
		/* return this.http
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
			); */


			return this.http
                .get<any>(`${environment.BACKEND_DUMMY_LOGIN}`) 
                .pipe(
                    map((authResult: any) => {
                        this.setLocalStorage(authResult); // Llama a setLocalStorage con el resultado de autenticación
                        console.log('from auth service login ', authResult);
						return authResult; // Devuelve el resultado del registro
                    }),
                    catchError((error: HttpErrorResponse) => {
                        // Maneja el error aquí (muestra un mensaje de error)
                        console.log('porque da error', error)
                        return throwError(error);
                    })
                );


	}

	register(user: User): Observable<void> {
		// const userJSON = user
		/*  console.log('from auth service register', user)
        return this.http
            .post<void>(
                `${environment.BACKEND_ITA_WIKI_BASE_URL}${environment.BACKEND_REGISTER}`,
                user  // transformar en JSON

            )
            .pipe(
                map((authResult: any) => {
                    this.setLocalStorage(authResult); // Llama a setLocalStorage con el resultado de autenticación
                    console.log('from auth service ', authResult);
                }),
                catchError((error: HttpErrorResponse) => {
                    //  Handle error here (show an error message)
                    return throwError(error);
                })
            ); */
            console.log('from auth service register', user);

            // Simular la solicitud con datos de un archivo dummy
            return this.http
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
                );
	}

	private setLocalStorage(authResult: any) {
		// Takes the JWT expiresIn value and add that number of seconds
		// to the current "moment" in time to get an expiry date
		const expiresAt = moment().add(authResult.expiresIn, "second");

		// Stores our JWT token and its expiry date in localStorage
		localStorage.setItem("id_token", authResult.idToken);
		localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()));
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
