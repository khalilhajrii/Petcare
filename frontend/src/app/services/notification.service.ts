import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { ToastController } from '@ionic/angular';

export interface Notification {
  id: string;
  message: string;
  type: 'reservation_created' | 'reservation_approved' | 'reservation_rejected';
  read: boolean;
  createdAt: Date;
  reservationId?: number;
  userId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private socket: Socket;
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();
  private userId: number | null = null;

  constructor(
    private authService: AuthService,
    private toastController: ToastController
  ) {
    // Initialize socket connection
    this.socket = io(environment.apiUrl, {
      transports: ['websocket'],
      autoConnect: false
    });

    // Get user ID from auth service
    this.authService.waitForAuthInitialized().then(() => {
      const user = this.authService.currentUserValue;
      if (user && user.id) {
        this.userId = user.id;
        this.connect();
      }
    });

    // Handle reconnection
    this.authService.currentUser$.subscribe(user => {
      if (user && user.id) {
        this.userId = user.id;
        if (!this.socket.connected) {
          this.connect();
        }
      } else {
        this.disconnect();
      }
    });
  }

  private connect(): void {
    if (!this.socket.connected && this.userId) {
      // Remove any existing listeners to prevent duplicates
      this.socket.off('notification');
      this.socket.off('connect_error');
      
      this.socket.connect();
      
      // Join user's room
      this.socket.emit('join', { userId: this.userId });

      // Listen for notifications
      this.socket.on('notification', (notification: Notification) => {
        this.handleNewNotification(notification);
      });

      // Handle connection errors
      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });
    }
  }

  private disconnect(): void {
    if (this.socket.connected) {
      this.socket.disconnect();
    }
  }

  private handleNewNotification(notification: Notification): void {
    // Add to notifications list
    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([notification, ...currentNotifications]);

    // Show toast notification
    this.showNotificationToast(notification);
  }

  private async showNotificationToast(notification: Notification): Promise<void> {
    const toast = await this.toastController.create({
      message: notification.message,
      duration: 3000,
      position: 'top',
      color: this.getToastColor(notification.type),
      buttons: [
        {
          text: 'Voir',
          role: 'info',
          handler: () => {
            this.markAsRead(notification.id);
            // Navigate to reservation details if applicable
            if (notification.reservationId) {
              // Check if user is authenticated before navigating
              const user = this.authService.currentUserValue;
              if (user && user.id) {
                // Use window.location to ensure a full page reload which will trigger auth checks
                window.location.href = `/client/reservations/${notification.reservationId}`;
              }
            }
          }
        }
      ]
    });
    await toast.present();
  }

  private getToastColor(type: string): string {
    switch (type) {
      case 'reservation_approved':
        return 'success';
      case 'reservation_rejected':
        return 'danger';
      default:
        return 'primary';
    }
  }

  public getUnreadCount(): Observable<number> {
    return this.notifications$.pipe(
      map((notifications: Notification[]) => {
        return notifications.filter((n: Notification) => !n.read).length;
      })
    );
  }

  public markAsRead(notificationId: string): void {
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = currentNotifications.map(n => {
      if (n.id === notificationId) {
        // Create a new notification object with read set to true
        return { ...n, read: true };
      }
      return n;
    });
    this.notificationsSubject.next(updatedNotifications);
  }

  public markAllAsRead(): void {
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = currentNotifications.map(n => ({ ...n, read: true }));
    this.notificationsSubject.next(updatedNotifications);
  }

  public clearNotifications(): void {
    this.notificationsSubject.next([]);
  }
}