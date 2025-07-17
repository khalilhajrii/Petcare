import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, PopoverController } from '@ionic/angular';
import { NotificationService } from '../../../services/notification.service';
import { NotificationListComponent } from '../notification-list/notification-list.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notification-button',
  templateUrl: './notification-button.component.html',
  styleUrls: ['./notification-button.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class NotificationButtonComponent implements OnInit, OnDestroy {
  unreadCount = 0;
  private subscription: Subscription = new Subscription();

  constructor(
    private notificationService: NotificationService,
    private popoverController: PopoverController
  ) {}

  ngOnInit() {
    this.subscription.add(
      this.notificationService.getUnreadCount().subscribe(count => {
        this.unreadCount = count;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  async openNotifications(event: Event) {
    const popover = await this.popoverController.create({
      component: NotificationListComponent,
      event: event,
      translucent: true,
      cssClass: 'notification-popover',
      showBackdrop: true
    });

    await popover.present();
  }
}