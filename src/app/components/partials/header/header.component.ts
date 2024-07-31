import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/shared/models/user';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{

  isMenuOpen = false;
  sidebarVisible: boolean = false;

  user!:User;

  constructor(private userService:UserService){}
  
  ngOnInit(): void {
      this.userService.userObservable.subscribe(newUser=>{
        this.user=newUser;
      });
  }
  get isAuth(){
    return this.user.token;
  }
  
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

}
