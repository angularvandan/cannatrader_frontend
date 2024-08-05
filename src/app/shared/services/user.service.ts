import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User, UserDetails } from '../models/user';
import { ToastrService } from 'ngx-toastr';
import { IUserLogin } from '../interfaces/IUserLogin';
import { Router } from '@angular/router';

const USER_KEY='cannatrader_user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl="https://cannatrader.onrender.com";

  private userSubject =new BehaviorSubject<User>(this.getuserFromLocalStorage());
  public userObservable:Observable<User>;

  constructor(private http:HttpClient,private tostr:ToastrService,private router:Router) {
    this.userObservable=this.userSubject.asObservable();

  }
  public get currentUser():User{
    return this.userSubject.value;//it will give latest value of subject;
  }

  login(login:IUserLogin): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/api/users/login`, login).pipe(
      tap({
        next:(response)=>{
          console.log(response);
          this.setUserToLocalStorage(response);
          this.userSubject.next(response);

        },error:(err)=>{
          console.log(err);
        }
      })
    );
  }

  logOut(){
    this.userSubject.next(new User());
    localStorage.removeItem(USER_KEY);
    this.router.navigate(['/home']);

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
    return this.http.post<any>(`${this.baseUrl}/api/users/verify-registerOtp`, data);
  }

  resetPassword(email: string): Observable<any> {
    const body = { email: email };
    return this.http.post<any>(`${this.baseUrl}/api/users/forgotPassword`, body);
  }
  verifyOtpForResetPassword(payload:any): Observable<any>{
    return this.http.post<any>(`${this.baseUrl}/api/users/verifyOTP`, payload);
  }
  updatePassword(userId: string, newPassword: string, confirmPassword: string): Observable<any> {
    const body = { userId, newPassword, confirmPassword };
    return this.http.put<any>(`${this.baseUrl}/api/users/resetpassword`, body);
  }
  getUserProfile(): Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/api/users/profile`).pipe(
      tap({
        next:(response)=>{
          console.log(response);
          
          this.setUserToLocalStorage({...this.getuserFromLocalStorage(),user:response.user});
          this.userSubject.next(this.getuserFromLocalStorage());

        },error:(err)=>{
          console.log(err);
          this.tostr.error(err.error.error.message);
        }
      })
    );;
  }
  updateUserProfile(userData:any){
    return this.http.put<any>(`${this.baseUrl}/api/users/profile`,userData);

  }
  registerCompany(companyInfo:any){
    return this.http.post<any>(`${this.baseUrl}/api/company/register`,companyInfo);

  }
  getRegisterCompany(){
    return this.http.get<any>(`${this.baseUrl}/api/company/getCompanyInfo`);
  }
  changePassword(passwordData:any){
    return this.http.put<any>(`${this.baseUrl}/api/users/changePassword`,passwordData);
  }
  deleteUserAccount(){
    return this.http.delete<any>(`${this.baseUrl}/api/users/delete`);

  }
}
