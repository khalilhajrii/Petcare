import { Component, OnInit } from '@angular/core';
import { ProviderService, Service, Reservation } from '../provider.service';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';



@Component({
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule],
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  services: Service[] = [];
  reservations: Reservation[] = [];
  isLoading = true;
  todayDate = new Date().toISOString().split('T')[0];

  constructor(private providerService: ProviderService, private auth: AuthService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    
    // Load services
    this.providerService.getServices().subscribe(services => {
      this.services = services;
      
      // After services are loaded, load reservations
      this.loadReservations();
    });
  }

  loadReservations() {
    this.providerService.getReservations().subscribe({
      next: (reservations) => {
        this.reservations = reservations;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading reservations', error);
        this.isLoading = false;
      }
    });
  }

  getUpcomingReservations() {
    return this.reservations.filter(res => {
      const reservDate = new Date(res.date);
      const today = new Date(this.todayDate);
      return reservDate >= today;
    }).sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  }

  getPastReservations() {
    return this.reservations.filter(res => {
      const reservDate = new Date(res.date);
      const today = new Date(this.todayDate);
      return reservDate < today;
    }).sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }

  getTodayReservations() {
    return this.reservations.filter(res => {
      const reservDate = new Date(res.date).toISOString().split('T')[0];
      return reservDate === this.todayDate;
    }).sort((a, b) => {
      return a.time.localeCompare(b.time);
    });
  }

  getServiceNames(services: Service[]): string {
    return services.map(s => s.nomservice).join(', ');
  }

  formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  }

  getDateDay(dateString: string): number {
    return new Date(dateString).getDate();
  }

  getDateMonth(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR', {month: 'short'});
  }

  // La méthode logout a été déplacée vers le composant de layout
}
