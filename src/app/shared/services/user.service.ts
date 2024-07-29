import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IUserLogin } from '../interfaces/IUserLogin';
import { IUserRegister } from '../interfaces/IUserRegister';


@Injectable({
  providedIn: 'root'
})
export class UserService {


  private baseUrl="https://cannatrader.onrender.com";

  public isVisible: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor(private http:HttpClient) { }

  isLogin(status:boolean){
    console.log(status);
    this.isVisible.next(status);
  }

  login(login:any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/users/login`, login);
  }

  register(register: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/users/register`, register);
  }

}
