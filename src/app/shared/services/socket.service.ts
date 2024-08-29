import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket: Socket;
  private readonly SOCKET_ENDPOINT = 'https://cannatrader.onrender.com';

  constructor() {
    this.socket = io(this.SOCKET_ENDPOINT, {
      transports: ['websocket'], // Use WebSocket transport only (optional)
      withCredentials: true // Use credentials for CORS (optional)
    });
  }
  // Emit an event to the server
  emit(event: string, data: any): void {
    this.socket.emit(event, data);
  }
  // Listen for an event from the server
  on(event: string): Observable<any> {
    return new Observable((observer) => {
      this.socket.on(event, (data) => {
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
