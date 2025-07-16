import { Component, OnInit } from '@angular/core';
import { ClientService } from '../client.service';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
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

  constructor(private clientService: ClientService, private auth: AuthService) {}

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
}
