import { Injectable } from '@angular/core';
import { User } from '../../models/User';

/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthServiceProvider {
  private isLoggedIn = false;
  private user:User;
  
  constructor() { }

  login(user){
    this.isLoggedIn = true;
    this.user = new User(user);
  }

  logout(){
    this.isLoggedIn = false;
    this.user = null;
  }

  authenticated() : boolean{
    return this.isLoggedIn;
  }
  
  getUser() : User{
    return this.user;
  }
}
