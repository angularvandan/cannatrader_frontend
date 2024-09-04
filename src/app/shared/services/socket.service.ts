import { Injectable, OnInit } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  public socket!: Socket;
  private readonly SOCKET_ENDPOINT = 'https://cannatrader.onrender.com';

  constructor() {
    this.socketConnection();
  }

  socketConnection(){
    this.socket = io(this.SOCKET_ENDPOINT, {
      transports: ['websocket'], // Use WebSocket transport only (optional)
      withCredentials: true, // Use credentials for CORS (optional)
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });

    this.socket.connect();
    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id);
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected. Attempting to reconnect...');
      this.socket.connect();
    });
  }

  // Emit an event to the server
  emit(event: string, data: any): void {
    console.log(data);
    this.socket.emit(event, data);
  }
  // Listen for an event from the server
  on(event: string): Observable<any> {
    console.log(event);
    return new Observable((observer) => {
      this.socket.on(event, (data) => {
        console.log(data);
        observer.next(data);
      });

      // Cleanup listener on unsubscribe
      return () => this.socket.off(event);
    });
  }
  
  // Disconnect the socket
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
