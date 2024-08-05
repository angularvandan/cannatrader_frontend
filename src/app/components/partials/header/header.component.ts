import { Component, OnInit, Renderer2 } from '@angular/core';
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

  constructor(private userService:UserService,private renderer:Renderer2){}
  
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
  notificationOpenClick() {
    this.sidebarVisible=true;
    this.showAndHideScroll();
  }
  showAndHideScroll(){
    console.log('hi');
    if (this.sidebarVisible) {
      this.renderer.addClass(document.body, 'no-scroll');
    } else {
      this.renderer.removeClass(document.body, 'no-scroll');
    }
  }
  logOut(){
    this.toggleMenu();
    this.userService.logOut();
  }

}
