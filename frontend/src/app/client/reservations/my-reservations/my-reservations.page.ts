import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController, RefresherCustomEvent } from '@ionic/angular';
import { ClientService } from '../../client.service';
import { Reservation, ReservationStatus } from '../../../models/reservation.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-my-reservations',
  templateUrl: './my-reservations.page.html',
  styleUrls: ['./my-reservations.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule]
})
export class MyReservationsPage implements OnInit {
  reservations: Reservation[] = [];
  isLoading = true;
  error: string | null = null;
  
  constructor(
    private clientService: ClientService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadReservations();
  }

  loadReservations() {
    this.isLoading = true;
    this.error = null;
    
    // Get the current user ID from localStorage
    const userIdStr = localStorage.getItem('userId');
    const currentUserId = userIdStr ? parseInt(userIdStr, 10) : null;
    
    if (!currentUserId) {
      this.error = 'Utilisateur non connecté. Veuillez vous connecter pour voir vos réservations.';
      this.isLoading = false;
      this.presentToast('Veuillez vous connecter pour voir vos réservations', 'warning');
      return;
    }
    
    this.clientService.getClientReservationsById(currentUserId).subscribe({
      next: (reservations) => {
        this.reservations = reservations;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading reservations:', error);
        this.error = 'Impossible de charger les réservations. Veuillez réessayer.';
        this.isLoading = false;
        this.presentToast('Erreur lors du chargement des réservations', 'danger');
      }
    });
  }

  handleRefresh(event: any) {
    // Get the current user ID from localStorage
    const userIdStr = localStorage.getItem('userId');
    const currentUserId = userIdStr ? parseInt(userIdStr, 10) : null;
    
    if (!currentUserId) {
      this.error = 'Utilisateur non connecté. Veuillez vous connecter pour voir vos réservations.';
      this.presentToast('Veuillez vous connecter pour voir vos réservations', 'warning');
      event.target.complete();
      return;
    }
    
    this.clientService.getClientReservationsById(currentUserId).subscribe({
      next: (reservations) => {
        this.reservations = reservations;
        event.target.complete();
      },
      error: (error) => {
        console.error('Error refreshing reservations:', error);
        this.error = 'Impossible de charger les réservations. Veuillez réessayer.';
        this.presentToast('Erreur lors du chargement des réservations', 'danger');
        event.target.complete();
      }
    });
  }

  async presentToast(message: string, color: 'success' | 'danger' | 'warning' = 'success') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color
    });
    toast.present();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getStatusColor(status: ReservationStatus): string {
    switch (status) {
      case ReservationStatus.APPROVED:
        return 'success';
      case ReservationStatus.REJECTED:
        return 'danger';
      case ReservationStatus.PENDING:
      default:
        return 'warning';
    }
  }

  getStatusLabel(status: ReservationStatus): string {
    switch (status) {
      case ReservationStatus.APPROVED:
        return 'Approuvée';
      case ReservationStatus.REJECTED:
        return 'Rejetée';
      case ReservationStatus.PENDING:
      default:
        return 'En attente';
    }
  }
}