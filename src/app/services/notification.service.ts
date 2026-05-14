import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface NotificationMessage {
  type: string;
  message: string;
  employeeName: string;
  cin: string;
  employeeId: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private stompClient: any;

  private notificationSubject =
    new BehaviorSubject<NotificationMessage | null>(null);

  notification$ = this.notificationSubject.asObservable();

  connect(): void {

    // 👉 IMPORT DYNAMIQUE (IMPORTANT)
    import('sockjs-client').then((SockJS: any) => {

      import('@stomp/stompjs').then((stomp: any) => {

        const Client = stomp.Client;

        const socket = new SockJS.default('http://localhost:8081/api/v1/ws');

        this.stompClient = new Client({
          webSocketFactory: () => socket,
          reconnectDelay: 5000,
          debug: (str: any) => console.log(str)
        });

        this.stompClient.onConnect = () => {

          console.log('✅ WebSocket connecté');

          this.stompClient.subscribe('/topic/admin-notifications', (message: any) => {

            const notification: NotificationMessage = JSON.parse(message.body);

            console.log('🔔 Notification reçue', notification);

            this.notificationSubject.next(notification);
          });
        };

        this.stompClient.activate();
      });
    });
  }
}
