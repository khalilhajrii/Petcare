import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, ToastController, IonicModule } from '@ionic/angular';
import { ProviderService, Service, Reservation } from '../../provider.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-service-reservations',
  templateUrl: './service-reservations.page.html',
  styleUrls: ['./service-reservations.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule]
})
export class ServiceReservationsPage implements OnInit {
  serviceId: number | null = null;
  service: Service | null = null;
  reservations: Reservation[] = [];
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private providerService: ProviderService,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.serviceId = +idParam;
        this.loadService();
        this.loadReservations();
      } else {
        this.showToast('ID de service non trouvé');
      }
    });
  }

  async loadService() {
    if (!this.serviceId) return;

    this.isLoading = true;
    this.providerService.getServiceById(this.serviceId).subscribe({
      next: (service) => {
        this.service = service;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading service', error);
        this.showToast('Erreur lors du chargement du service');
        this.isLoading = false;
      }
    });
  }

  async loadReservations() {
    if (!this.serviceId) return;

    this.isLoading = true;
    const loading = await this.loadingController.create({
      message: 'Chargement des réservations...'
    });
    await loading.present();

    this.providerService.getReservationsByServiceId(this.serviceId).subscribe({
      next: (reservations) => {
        this.reservations = reservations;
        this.isLoading = false;
        loading.dismiss();
      },
      error: (error) => {
        console.error('Error loading reservations', error);
        this.showToast('Erreur lors du chargement des réservations');
        this.isLoading = false;
        loading.dismiss();
      }
    });
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'pending': return 'En attente';
      case 'approved': return 'Approuvée';
      case 'rejected': return 'Refusée';
      default: return status;
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'pending': return 'warning';
      case 'approved': return 'success';
      case 'rejected': return 'danger';
      default: return 'medium';
    }
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }

  async updateStatus(reservationId: number, status: string) {
    const loading = await this.loadingController.create({
      message: status === 'approved' ? 'Approbation en cours...' : 'Rejet en cours...'
    });
    await loading.present();

    this.providerService.updateReservationStatus(reservationId, status).subscribe({
      next: (updatedReservation) => {
        // Mettre à jour la réservation dans la liste locale
        const index = this.reservations.findIndex(r => r.idreserv === reservationId);
        if (index !== -1) {
          this.reservations[index] = updatedReservation;
        }
        
        const statusMessage = status === 'approved' ? 'approuvée' : 'rejetée';
        this.showToast(`Réservation ${statusMessage} avec succès`);
        loading.dismiss();
      },
      error: (error) => {
        console.error(`Error updating reservation status:`, error);
        this.showToast(`Erreur lors de la mise à jour du statut: ${error.message || 'Erreur inconnue'}`);
        loading.dismiss();
      }
    });
  }
}