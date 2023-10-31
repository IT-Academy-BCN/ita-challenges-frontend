import moment from "moment";
import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Observable, catchError, map, throwError } from "rxjs";

@Injectable()
export class AuthService {

    /**
     * Gives us access to the Angular HTTP client so we can make requests to
     * our Express app
     */
    constructor(private http: HttpClient) {}

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
    login(email:string, password:string ) {
        //return this.http.post();
    }


    register(dni: any, email: any, password: any, repeatpassword: any): Observable<void> {
        const body = { dni: dni, email: email, password: password, repeatpassword: repeatpassword}
        return this.http.post<void>(`${environment.BACKEND_ITA_WIKI_BASE_URL}${environment.BACKEND_REGISTER}`, body)
          .pipe(
            map(() => {
              // You can navigate to a login page or do something else after successful registration
            }),
            catchError((error: HttpErrorResponse) => {
              // Handle error here (show an error message)
              return throwError(error);
            })
          );
      }


    private setLocalStorage(authResult:any) {

        // Takes the JWT expiresIn value and add that number of seconds
        // to the current "moment" in time to get an expiry date
        const expiresAt = moment().add(authResult.expiresIn,'second');

        // Stores our JWT token and its expiry date in localStorage
        localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()) );
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
        const expiresAt = expiration !=null ? JSON.parse(expiration) : '';
        return moment(expiresAt);
    }
}