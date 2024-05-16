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
              private tokenService: TokenService){
              // private helper: CookieEncryptionHelper) {

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
    const userAdmin = await firstValueFrom(this.http.get<User>(environment.ADMIN_USER));

    if(userAdmin){
      await this.login(userAdmin);
    } else{
      console.error('Admin acount not found');
    }

    try {
      let userLoggedData = await this.getLoggedUserData();
      if (userLoggedData.role === 'ADMIN') {
        await firstValueFrom(
            this.http.patch((environment.BACKEND_ITA_SSO_BASE_URL.concat(environment.BACKEND_SSO_PATCH_USER).concat(`/${registerUserId}`)),
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
      let resp = await firstValueFrom(this.loginRequest(user));
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
// TODO: Desarrollar una vez validados los tokens. Por ahora, se usa solo cookie.service.
  public isUserLoggedIn() { 
    let isUserLoggedIn: boolean = false;
    let authToken = this.cookieService.get('authToken');
    if (authToken) {
        isUserLoggedIn = true;
    } else {
      let refreshToken = this.cookieService.get('refreshToken');
        if (refreshToken) {
            isUserLoggedIn = true;
        } else {
            isUserLoggedIn = false;
        }
    }
    console.log('is logged:' + isUserLoggedIn)
    return isUserLoggedIn;
   
  }

}


