import { AfterViewChecked, Component, ElementRef, HostListener, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { format, isToday, isTomorrow, isYesterday, parseISO } from 'date-fns';
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

  //it will update for show group of message with particular date
  chatGroups: { date: string, dateLabel: string, messages: ChatMessage[] }[] = [];
  filterUserNameOfChats:string='';
  filterChatsOfUsers:ChatModel[]=[];


  userId: string = '';
  chatId: string = '';
  receiverId: string = '';

  @ViewChildren('scrollContainer') private scrollContainer!: QueryList<ElementRef>;


  constructor(private socketService: SocketService, private productService: ProductService) {

  }
  ngOnInit(): void {

    this.checkWindowWidth();
    this.socketService.socketConnection();
    // this is for all user who has a chats
    this.getAllChats();

    //this is for real time ream message
    this.socketService.on('newMessage').subscribe({
      next: (response) => {

        response.createdAt = new Date().toISOString();
        response.updatedAt = new Date().toISOString();
        // console.log(response);

        this.messages.push(response);


        this.messages.sort((a, b) => {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        });

        //append messages in this method
        this.groupChatsByDate();
        //this is for show latest send message 
        this.addLastMessageIntoChat(response.chatId,response.content);

        if(this.activeUserChats.length){
          console.log('readed');
          this.readAllMessages(this.chatId);
        }

      }, error: (err) => {
        console.log(err);
      }
    })

  }
  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    // console.log(this.scrollContainer);
    try {
      if (this.scrollContainer.first) {
        this.scrollContainer.first.nativeElement.scrollTop = this.scrollContainer.first.nativeElement.scrollHeight;
      }
      if (this.scrollContainer.last) {
        this.scrollContainer.last.nativeElement.scrollTop = this.scrollContainer.last.nativeElement.scrollHeight;
      }
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }


  sendMessageToServer(chatId: string, content: string, senderId: string, receiverId: string): void {
    const message = { chatId, content, senderId, receiverId };
    // console.log(message);
    this.socketService.emit('sendMessage', message);

    this.productService.sendMessage(message).subscribe({
      next: (response) => {
        // console.log(response);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  addLastMessageIntoChat(chatId: string, content: string) {
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
        // console.log(response);

        this.chats=this.chats.map(chat=>{
          if(!chat.lastMessage.createdAt){
            chat.lastMessage.createdAt=new Date();
          }
          return chat;
        })
        

        //this is for sort the user who in the chat wrt latest message
        this.sortTheUserWhoInChats();

      }, error: (err: any) => {
        console.log(err);
      }
    })
  }

  get filterChatsUser(){
      return this.chats.filter(user=>user.chatPartner.name.toLowerCase().includes(this.filterUserNameOfChats.trim().toLowerCase()))
  }

  sortTheUserWhoInChats() {
    //this is for sort the user who in the chat wrt latest message
    const sortedChats = this.chats.sort((a, b) => {
      if (a.lastMessage === null) return 1; // Treat null as the latest
      if (b.lastMessage === null) return -1; // Treat null as the latest
      return new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime();
    });
    console.log(sortedChats);
  }

  getAllMessageByChatId(chatId: string, user: any) {
    //need to blank filet of user when click on specific
    this.filterUserNameOfChats='';

    //need chatId for send message;
    this.chatId = chatId;
    this.receiverId = user.id;

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
        // console.log(response);
        this.messages = response.data;

        this.messages.sort((a, b) => {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        });

        this.readAllMessages(this.chatId);

      }, error: (err) => {
        console.log(err);
      }, complete: () => {
        //this is for scroll chat below
        this.groupChatsByDate();
      }
    })
  }

  readAllMessages(chatId: string) {
    this.productService.readAllMessage(chatId).subscribe({
      next: (response) => {
        console.log(response);
      }, error: (err) => {
        console.log(err);
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
  //this is for desktop
  showChats(user: any) {
    this.activeUserChats.pop();
    this.activeUserChats.push(user);
  }
  //this is for mobile
  showChatsMobile(user: any) {
    this.showMobileViewChats = true;
    this.activeUserChats.pop();
    this.activeUserChats.push(user);
  }

  // this is for add the date of specific chats
  groupChatsByDate() {
    let previousDate = '';
    this.chatGroups = [];
    
    console.log(this.messages);
    this.messages.forEach(chat => {

      let date = chat.createdAt.toString();
      const messageDate = format(parseISO(date), 'yyyy-MM-dd');
      const dayLabel = this.getDayLabel(date);

      if (messageDate !== previousDate) {
        this.chatGroups.push({ date: messageDate, dateLabel: dayLabel, messages: [chat] });
        previousDate = messageDate;
      } else {
        this.chatGroups[this.chatGroups.length - 1].messages.push(chat);
      }
    });

    console.log(this.chatGroups);
  }

  getDayLabel(date: string): string {
    const parsedDate = parseISO(date);
    if (isToday(parsedDate)) return 'Today';
    if (isTomorrow(parsedDate)) return 'Tomorrow';
    if (isYesterday(parsedDate)) return 'Yesterday';
    return format(parsedDate, 'EEEE, MMMM d');
  }

  shouldShowDayLabel(date: string, index: number): boolean {
    return index === 0 || this.chatGroups[index - 1].date !== date;
  }

  //this is for show time of get and send message
  formatTime(date: Date): string {
    let dateString = date.toString();
    return format(parseISO(dateString), 'hh:mm a');
  }

  trackByDate(index: number, group: any): string {
    return group.date;
  }

  trackById(index: number, msg: any): string {
    return msg.id;
  }

  ngOnDestroy(): void {
    console.log('disconnect');
    this.socketService.disconnect();
  }


}
