import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { NotificationService, Notification } from '../../../services/notification.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class NotificationListComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  private subscription: Subscription = new Subscription();

  constructor(
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.subscription.add(
      this.notificationService.notifications$.subscribe(notifications => {
        this.notifications = notifications;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  markAsRead(notification: Notification) {
    this.notificationService.markAsRead(notification.id);
    
    // Navigate to reservation details if applicable
    if (notification.reservationId) {
      this.router.navigate(['/client/reservations', notification.reservationId]);
    }
  }

  markAllAsRead() {
    this.notificationService.markAllAsRead();
  }

  clearAll() {
    this.notificationService.clearNotifications();
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'reservation_created':
        return 'calendar-outline';
      case 'reservation_approved':
        return 'checkmark-circle-outline';
      case 'reservation_rejected':
        return 'close-circle-outline';
      default:
        return 'notifications-outline';
    }
  }

  getNotificationColor(type: string): string {
    switch (type) {
      case 'reservation_approved':
        return 'success';
      case 'reservation_rejected':
        return 'danger';
      default:
        return 'primary';
    }
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - notificationDate.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'À l\'instant';
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `Il y a ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `Il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `Il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    return `Il y a ${diffInMonths} mois`;
  }
}