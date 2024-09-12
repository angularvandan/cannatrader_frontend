import { Component, OnInit, Renderer2 } from '@angular/core';
import { User } from 'src/app/shared/models/user';
import { ProductService } from 'src/app/shared/services/product.service';
import { UserService } from 'src/app/shared/services/user.service';

export interface Notification {
  id: string;
  title: string;
  message: string;
  image: string;
  userId: string;
  isRead: boolean;
  redirectUrl: string | null;
  createdAt: Date; // ISO 8601 date string
  updatedAt: Date; // ISO 8601 date string
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isMenuOpen = false;
  sidebarVisible: boolean = false;

  user!: User;
  notifications: Notification[] = [];
  totalReadFalseNotification:number=0;

  constructor(private userService: UserService, private productService: ProductService, private renderer: Renderer2) { }

  ngOnInit(): void {
    this.userService.userObservable.subscribe(newUser => {
      this.user = newUser;
    });

    this.productService.getNotifications().subscribe({
      next: (response: any) => {
        
        this.notifications = response.notifications;
        this.totalNumberOfNotificationReadFalse();

        console.log(this.notifications);
      }, error: (err) => {
        console.log(err);
      }
    })
  }
  readNotification(id:string){

    this.showIconForReadOrNot(id,true);

    this.productService.markAsRead(id).subscribe({
      next:(response)=>{
        console.log(response);
        this.totalNumberOfNotificationReadFalse();
      },error:(err)=>{
        console.log(err);
        this.showIconForReadOrNot(id,false);

      }
    })
  }

  totalNumberOfNotificationReadFalse(){
    this.totalReadFalseNotification = this.notifications.filter(notification => !notification.isRead).length;
  }

  showIconForReadOrNot(id:string,status:boolean){
    this.notifications=this.notifications.map((notification:Notification)=>{
      if(notification.id==id){
        notification.isRead=status;
        return notification;
      }
      return notification;
    })
  }


  get isAuth() {
    return this.user.token;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  notificationOpenClick() {
    this.sidebarVisible = true;
    this.showAndHideScroll();
  }
  showAndHideScroll() {
    // console.log('hi');
    if (this.sidebarVisible) {
      this.renderer.addClass(document.body, 'no-scroll');
    } else {
      this.renderer.removeClass(document.body, 'no-scroll');
    }
  }
  logOut() {
    this.toggleMenu();
    this.userService.logOut();
  }

}
