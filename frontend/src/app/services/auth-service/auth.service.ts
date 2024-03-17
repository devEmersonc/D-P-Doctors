import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public loginStatusSubject = new Subject<boolean>();

  private baseUrlAuth = "http://localhost:8080/auth";

  constructor(private http: HttpClient) { }

  generateToken(loginData: any){
    return this.http.post(`${this.baseUrlAuth}/login`, loginData);
  }

  currentUser(){
    return this.http.get(`${this.baseUrlAuth}/user_actual`);
  }

  
  loginUser(token:any){
    localStorage.setItem('token', token);
  }

  isLoggedIn(){
    let tokenStr = localStorage.getItem('token');
    if(tokenStr == undefined || tokenStr == '' || tokenStr == null){
      return false;
    }
    return true;
  }

  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return true;
  }

  getToken(){
    return localStorage.getItem('token');
  }

  setUser(user:any){
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser(){
    let userStr = localStorage.getItem('user');
    if(userStr != null){
      return JSON.parse(userStr);
    }else{
      this.logout();
      return null;
    }
  }

  getUserRole(){
    let user = this.getUser();
    return user.authorities[0].authority;
  }

  getCurrentUser(){
    return this.http.get(`${this.baseUrlAuth}/user_actual`);
  }
}
