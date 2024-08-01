import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private userService:UserService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    let token =this.userService.currentUser.token; // Example: You might store it in localStorage

    // Clone the request and add the Authorization header
    const authReq = request.clone({
      headers: request.headers.set('Authorization', `${token}`)
    });
    console.log(token);
    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          // Redirect to login if token is invalid or expired
          this.userService.logOut();
        }
        return throwError(() => error);
      })
    );
  }
}
