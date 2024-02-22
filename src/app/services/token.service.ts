import { Injectable } from '@angular/core';
import {CookieService} from "ngx-cookie-service";

@Injectable({
    providedIn: 'root'
})
export class TokenService {

    constructor(private cookieService: CookieService) { }

    private token: string | null = null;

    setToken(token: string): void {
        this.token = token;
    }

    public getToken() {
        return this.cookieService.get('authToken');
    }

    public getRefreshToken() {
        return this.cookieService.get('refreshToken')
    }

    clearToken(): void {
        this.token = null;
    }

    // Check if the token is expired
    public isTokenExpired(token: string): boolean {
        const expiry = JSON.parse(atob(token.split('.')[1])).exp;
        return Math.floor(new Date().getTime() / 1000) >= expiry;
    }
    /* See if token is valid */
    public isTokenValid(token: string): boolean { //todo: Promise<boolean>
        return true;
    }

    /* return if token valid */
    async checkToken(token: string): Promise<boolean> {
        return true;
    }
}