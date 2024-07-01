import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
  constructor(private userService:UserService){}
  ngOnInit(): void {
  }

  onLogin(){
    this.userService.isLogin(true);
  }
}
