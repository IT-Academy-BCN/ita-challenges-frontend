import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userRegistered: boolean = false;
  userLoggedIn: boolean = false;
  userSentASolution: boolean = false;


  constructor() { }
}
