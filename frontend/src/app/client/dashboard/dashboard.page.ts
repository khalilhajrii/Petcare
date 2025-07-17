import { Component, OnInit } from '@angular/core';
import { ClientService } from '../client.service';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { Reservation, ReservationStatus } from '../../models/reservation.model';

@Component({
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule],
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  pets: any[] = [];
  upcomingReservations: Reservation[] = [];

  constructor(private clientService: ClientService, private auth: AuthService,private router: Router) {}

  ngOnInit() {
    this.loadPets();
    this.loadUpcomingReservations();
  }

  loadPets() {
    this.clientService.getPets().subscribe(pets => this.pets = pets);
  }

  loadUpcomingReservations() {
    // Get the current user ID from localStorage
    const userIdStr = localStorage.getItem('userId');
    const currentUserId = userIdStr ? parseInt(userIdStr, 10) : null;
    
    if (currentUserId) {
      this.clientService.getClientReservationsById(currentUserId).subscribe(reservations => {
        // Filter only approved reservations
        this.upcomingReservations = reservations
          .filter(res => res.status === ReservationStatus.APPROVED)
          // Sort by date (ascending)
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      });
    }
  }

  logout() {
    this.auth.logout();
  }
    getPetColor(petType: string): string {
    const colors: {[key: string]: string} = {
      'Chien': '#FF9E80',    // Orange
      'Chat': '#80DEEA',     // Light Blue
      'Oiseau': '#CE93D8',   // Purple
      'Poisson': '#81D4FA',  // Blue
      'Reptile': '#A5D6A7',  // Green
      'default': '#B0BEC5'   // Grey (default)
    };
    return colors[petType] || colors['default'];
  }
    getPetIcon(petType: string): string {
    const icons: {[key: string]: string} = {
      'Chien': 'paw-outline',
      'Chat': 'paw-outline',
      'Oiseau': 'bird-outline',
      'Poisson': 'fish-outline',
      'Reptile': 'reorder-four-outline',
      'default': 'paw-outline'
    };
    return icons[petType] || icons['default'];
  }
    navigateToPet(petId: number) {
    this.router.navigate(['/client/pets', petId]);
  }
}
