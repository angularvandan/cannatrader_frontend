import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public isVisible: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor() { }

  isLogin(status:boolean){
    console.log(status);
    this.isVisible.next(status);
  }
}
