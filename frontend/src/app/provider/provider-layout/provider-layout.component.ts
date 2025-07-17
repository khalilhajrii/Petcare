import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { NotificationButtonComponent } from '../../client/notifications/notification-button/notification-button.component';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-provider-layout',
  templateUrl: './provider-layout.component.html',
  styleUrls: ['./provider-layout.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule, NotificationButtonComponent]
})
export class ProviderLayoutComponent implements OnInit {
  pageTitle = 'Dashboard';

  constructor(
    private router: Router, 
    private auth: AuthService,
    private notificationService: NotificationService
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateTitle();
      }
    });
  }

  ngOnInit() {
    this.updateTitle();
  }

  updateTitle() {
    const url = this.router.url;
    if (url.includes('/dashboard')) {
      this.pageTitle = 'Dashboard';
    } else if (url.includes('/profile')) {
      this.pageTitle = 'Mon Profil';
    } else if (url.includes('/services')) {
      this.pageTitle = 'Mes Services';
    } else {
      this.pageTitle = 'PetCare Prestataire';
    }
  }

  logout() {
    this.auth.logout();
  }
}