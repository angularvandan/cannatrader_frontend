import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat-details',
  templateUrl: './chat-details.component.html',
  styleUrls: ['./chat-details.component.scss']
})
export class ChatDetailsComponent implements OnInit{

  users:any[]=[
    {image:'../../../../../assets/chats/user.jpg',name:'Jayden',content:'Checkout our new products...',time:'09:09 AM',count:'2'},
    {image:'../../../../../assets/chats/user1.jpg',name:'Vandan',content:'Checkout our new products...',time:'09:09 AM',count:'2'},
    {image:'../../../../../assets/chats/user.jpg',name:'Yash',content:'Checkout our new products...',time:'09:09 AM',count:'2'},
    {image:'../../../../../assets/chats/user1.jpg',name:'Happy',content:'Checkout our new products...',time:'09:09 AM',count:'2'},
    {image:'../../../../../assets/chats/user.jpg',name:'Ayush',content:'Checkout our new products...',time:'09:09 AM',count:'2'},
    {image:'../../../../../assets/chats/user1.jpg',name:'Jayden',content:'Checkout our new products...',time:'09:09 AM',count:'2'},
    {image:'../../../../../assets/chats/user.jpg',name:'Jayden',content:'Checkout our new products...',time:'09:09 AM',count:'2'},
    {image:'../../../../../assets/chats/user1.jpg',name:'Jayden',content:'Checkout our new products...',time:'09:09 AM',count:'2'}
  ];
  userChatLeftMessage:any[]=[
    {content:'That sounds like a good plan. Would you like any edibles with that?',time:'09:10',id:'1'},
    {content:"'I'll take two kilograms of chocolate",time:'09:10',id:'2'},

    {content:"Great choice! That'll be $25.",time:'09:11',id:'1'},
    {content:"Not today, just the chocolate",time:'09:11',id:'2'},

    {content:"Would you like any edibles with that?",time:'09:12',id:'1'},
    {content:"Thanks for your help!",time:'09:12',id:'2'},

    {content:"You're welcome!",time:'09:13',id:'1'}
  ];

  activeUserChats:any[]=[
    {image:'../../../../../assets/chats/user.jpg',name:'Jayden',content:'Checkout our new products...',time:'09:09 AM',count:'2'}
  ];
 
  showMobileViewChats:boolean=false;
  
  constructor(){

  }
  ngOnInit(): void {
      
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkWindowWidth();
  }
  private checkWindowWidth(){
    if (window.innerWidth > 768) {
      this.showMobileViewChats=false;

    }
  }
  showChats(user:any){
    this.activeUserChats.pop();
    this.activeUserChats.push(user);
  }
  showChatsMobile(user:any){
    this.showMobileViewChats=true;
    this.activeUserChats.pop();
    this.activeUserChats.push(user);
  }

}
