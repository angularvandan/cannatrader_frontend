import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{

  isMenuOpen = false;
  sidebarVisible: boolean = false;
  scrollPosition = 0;
  loginStatus:boolean=true;

  constructor(private userService:UserService){}
  
  ngOnInit(): void {
      this.userService.isVisible.subscribe((status:boolean)=>{
        this.loginStatus=!status;
        console.log(status);
      })
  }
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  //   if (this.isMenuOpen) {
  //     this.disableScroll()
  //   } else {
  //     this.enableScroll()
  //   }
  }
  // disableScroll() {
  //   this.scrollPosition = window.pageYOffset;
  //   document.body.style.position = 'fixed';
  //   document.body.style.top = `-${this.scrollPosition}px`;
  //   document.body.style.width = '100%';
  // }
  // enableScroll() {
  //   document.body.style.position = '';
  //   document.body.style.top = '';
  //   window.scrollTo(0, this.scrollPosition);
  // }

}
