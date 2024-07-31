import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../models/user';
import { ToastrService } from 'ngx-toastr';

const USER_KEY='cannatrader_user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl="https://cannatrader.onrender.com";

  private userSubject =new BehaviorSubject<User>(this.getuserFromLocalStorage());
  public userObservable:Observable<User>;

  constructor(private http:HttpClient,private tostr:ToastrService) {
    this.userObservable=this.userSubject.asObservable();

  }
  public get currentUser():User{
    return this.userSubject.value;//it will give latest value of subject;
  }

  login(login:any): Observable<any> {
    return this.http.post<User>(`${this.baseUrl}/api/users/login`, login).pipe(
      tap({
        next:(response)=>{
          console.log(response);
          this.setUserToLocalStorage(response);
          this.userSubject.next(response);

          this.tostr.success('Login Successfully',response.user.name);

        },error:(err)=>{
          console.log(err);
          this.tostr.error(err.error.error.message);
        }
      })
    );
  }

  logOut(){
    this.userSubject.next(new User());
    localStorage.removeItem(USER_KEY);

  }

  register(register: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/users/register`, register);
  }

  private setUserToLocalStorage(user:User){
    localStorage.setItem(USER_KEY,JSON.stringify(user))
  }

  private getuserFromLocalStorage():User{
    const userJson=localStorage.getItem(USER_KEY);
    if(userJson) return JSON.parse(userJson)as User;
    return new User();
  }

  verifyOtpForEmail(data:any){
    return this.http.post<any>(`${this.baseUrl}/api/users/verifyOTP`, data);
  }

}
