import { Component, HostListener, OnInit } from '@angular/core';
import { ProductService } from 'src/app/shared/services/product.service';
import { SocketService } from 'src/app/shared/services/socket.service';

export interface ChatModel {
  chatId: string;
  chatPartner: ChatPartner;
  lastMessage: LastMessage;
  unreadCount: number;
}

export interface ChatPartner {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface LastMessage {
  id: string;
  content: string;
  senderId: string;
  createdAt: Date;
}


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

  activeUserChats:ChatPartner[]=[

  ];
 
  showMobileViewChats:boolean=false;

  message: string = '';
  messages: string[] = [];
  chats:ChatModel[]=[];
  userId:string='';
  
  constructor(private socketService: SocketService,private productService:ProductService){
    
  }
  ngOnInit(): void {

    this.socketService.on('newMessage').subscribe((message: string) => {
      this.messages.push(message);
    });

    this.getAllChats();
  }
  sendMessage(): void {
    if (this.message.trim()) {
      this.socketService.emit('sendMessage', this.message);
      this.message = ''; // Clear input field after sending
    }
  }

  getAllChats(){
    this.productService.getAllChats().subscribe({
      next:(response:any)=>{
        this.chats=response.chats;
        this.userId=response.userId;
      },error:(err:any)=>{
        console.log(err);
      }
    })
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
