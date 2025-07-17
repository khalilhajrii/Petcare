import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { filter } from 'rxjs/operators';
import { ChatbotComponent } from '../chatbot/chatbot.component';
import { NotificationButtonComponent } from '../notifications/notification-button/notification-button.component';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-client-layout',
  templateUrl: './client-layout.component.html',
  styleUrls: ['./client-layout.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule, ChatbotComponent, NotificationButtonComponent]
})
export class ClientLayoutComponent implements OnInit {
  pageTitle = 'PetCare';

  constructor(
    private auth: AuthService, 
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateTitle();
    });
    
    // Set initial title
    this.updateTitle();
  }

  updateTitle() {
    const url = this.router.url;
    if (url.includes('/dashboard')) {
      this.pageTitle = 'Dashboard';
    } else if (url.includes('/profile')) {
      this.pageTitle = 'Mon Profil';
    } else if (url.includes('/pets/new')) {
      this.pageTitle = 'Ajouter un animal';
    } else if (url.includes('/pets/') && url.split('/').length > 3) {
      this.pageTitle = 'Modifier l\'animal';
    } else if (url.includes('/pets')) {
      this.pageTitle = 'Mes Animaux';
    } else if (url.includes('/services')) {
      this.pageTitle = 'Services';
    } else {
      this.pageTitle = 'PetCare';
    }
  }

  logout() {
    this.auth.logout();
  }
}