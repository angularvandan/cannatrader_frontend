import { AfterViewChecked, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
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
// this is for chat message
export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  receiverId: string;
  content: string;
  readStatus: boolean;
  createdAt: Date;
  updatedAt: Date;
}


@Component({
  selector: 'app-chat-details',
  templateUrl: './chat-details.component.html',
  styleUrls: ['./chat-details.component.scss']
})
export class ChatDetailsComponent implements OnInit, AfterViewChecked, OnDestroy {

  activeUserChats: ChatPartner[] = [

  ];

  showMobileViewChats: boolean = false;
  isMobile: boolean = true;

  message: string = '';
  messages: ChatMessage[] = [];
  chats: ChatModel[] = [];

  userId: string = '';
  chatId: string = '';
  receiverId: string = '';


  constructor(private socketService: SocketService, private productService: ProductService) {

  }
  ngOnInit(): void {

    this.checkWindowWidth();
    this.socketService.socketConnection();
    // this is for all user who has a chats
    this.getAllChats();

    //this is for real time ream message
    this.socketService.on('newMessage').subscribe({
      next: (message) => {
        console.log(message);
        this.messages.push(message);
      }, error: (err) => {
        console.log(err);
      }
    })
    
  }
  ngAfterViewChecked(): void {
    this.scrollToElement();
  }


  sendMessageToServer(chatId: string, content: string, senderId: string, receiverId: string): void {
    const message = { chatId, content, senderId, receiverId };
    console.log(message);
    this.socketService.emit('sendMessage', message);


    //this is for show latest send message 
    this.chats = this.chats.map((chat) => {
      if (chat.chatId == chatId) {
        chat.lastMessage.content = content;
        return chat;
      }
      return chat;
    })
  }

  sendMessage() {
    this.message = this.message.trim();
    if (this.message != '') {
      this.sendMessageToServer(this.chatId, this.message, this.userId, this.receiverId);
    }
    this.message = '';
  }

  getAllChats() {
    this.productService.getAllChats().subscribe({
      next: (response: any) => {
        this.chats = response.chats;
        this.userId = response.userId;
        console.log(response);

        //this is for sort the user who in the chat wrt latest message
        this.sortTheUserWhoInChats();

      }, error: (err: any) => {
        console.log(err);
      }
    })
  }

  sortTheUserWhoInChats(){
    //this is for sort the user who in the chat wrt latest message
    const sortedChats = this.chats.sort((a, b) => {
      if (a.lastMessage === null) return 1; // Treat null as the latest
      if (b.lastMessage === null) return -1; // Treat null as the latest
      return new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime();
    });
    console.log(sortedChats);
  }

  getAllMessageByChatId(chatId: string, user: any) {
    //need chatId for send message;
    this.chatId = chatId;
    this.receiverId = user.id;
    console.log(this.chatId);

    this.chats = this.chats.map((chat) => {
      if (chat.chatId == chatId) {
        chat.unreadCount = 0;
        return chat;
      }
      return chat;
    })

    //this is for show in mobile and desktop
    console.log(this.isMobile);
    if (this.isMobile) {
      this.showChatsMobile(user);
    }
    else {
      this.showChats(user);
    }

    this.selectChatRoom(this.chatId);

    this.productService.getAllMessages(this.chatId).subscribe({
      next: (response: any) => {
        console.log(response);
        this.messages = response.data;
      }, error: (err) => {
        console.log(err);
      }, complete: () => {
        //this is for scroll chat below
        this.scrollToElement();
      }
    })
  }

  selectChatRoom(chatRoomId: string) {
    this.socketService.emit('joinChat', chatRoomId);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkWindowWidth();
  }

  private checkWindowWidth() {
    if (window.innerWidth > 768) {
      this.showMobileViewChats = false;
      this.isMobile = false;
    }
    else {
      this.isMobile = true;
    }
  }
  showChats(user: any) {
    this.activeUserChats.pop();
    this.activeUserChats.push(user);
  }
  showChatsMobile(user: any) {
    this.showMobileViewChats = true;
    this.activeUserChats.pop();
    this.activeUserChats.push(user);
  }

  scrollToElement(): void {
    const element = document.getElementById('scrollBelowChat');
    const element2 = document.getElementById('scrollBelowChat2');
    // console.log(element);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (element2) {
      element2.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  ngOnDestroy(): void {
    console.log('disconnect');
    this.socketService.disconnect();
  }


}
