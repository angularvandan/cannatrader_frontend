import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss']
})
export class ProfileDetailsComponent implements OnInit{
  constructor(private userService:UserService){}
  ngOnInit(): void {
      
  }
  onLogout(){
    this.userService.isLogin(false);
  }
}
