import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loginUser, registerUser } from '../models/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

constructor(private http: HttpClient) { }

  login(loginForm: loginUser) {
    this.http.post('url', loginForm);
  }

  register(registerForm: registerUser) {
    this.http.post('url', registerForm);
  }
  
}
