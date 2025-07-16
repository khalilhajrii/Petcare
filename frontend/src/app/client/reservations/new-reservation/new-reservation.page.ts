import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController, LoadingController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { ClientService } from '../../client.service';

@Component({
  selector: 'app-new-reservation',
  templateUrl: './new-reservation.page.html',
  styleUrls: ['./new-reservation.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class NewReservationPage implements OnInit {
  reservation = {
    date: new Date().toISOString(),
    time: '10:00',
    location: '',
    petId: 0,
    serviceIds: [] as number[]
  };

  pets: any[] = [];
  services: any[] = [];
  isLoading = true;
  submitting = false;

  constructor(
    private clientService: ClientService,
    private router: Router,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadPets();
    this.loadServices();
    this.route.queryParams.subscribe(params => {
      const serviceId = params['serviceId'];
      if (serviceId) {
        this.reservation.serviceIds = [Number(serviceId)];
      }
    });
  }

  loadPets() {
    this.clientService.getPets().subscribe({
      next: (pets) => {
        this.pets = pets;
        if (pets.length > 0) {
          this.reservation.petId = pets[0].idPet;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading pets', error);
        this.presentToast('Erreur lors du chargement des animaux', 'danger');
        this.isLoading = false;
      }
    });
  }

  loadServices() {
    this.clientService.getServices().subscribe({
      next: (services) => {
        this.services = services;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading services', error);
        this.presentToast('Erreur lors du chargement des services', 'danger');
        this.isLoading = false;
      }
    });
  }

  toggleService(serviceId: number) {
    const index = this.reservation.serviceIds.indexOf(serviceId);
    if (index > -1) {
      this.reservation.serviceIds.splice(index, 1);
    } else {
      this.reservation.serviceIds.push(serviceId);
    }
  }

  isServiceSelected(serviceId: number): boolean {
    return this.reservation.serviceIds.includes(serviceId);
  }

  async submitReservation() {
    if (!this.validateForm()) {
      return;
    }

    this.submitting = true;
    const loading = await this.loadingController.create({
      message: 'Création de la réservation...'
    });
    await loading.present();

    // Get userId from localStorage
    const userId = localStorage.getItem('userId');
    if (!userId) {
      this.presentToast('Erreur: Utilisateur non identifié', 'danger');
      loading.dismiss();
      this.submitting = false;
      return;
    }

    const reservationData = {
      date: this.reservation.date.split('T')[0],
      time: this.reservation.time,
      lieu: this.reservation.location, // Map 'location' to 'lieu' as expected by the backend
      petId: this.reservation.petId,
      userId: Number(userId), // Include userId as required by the backend
      serviceIds: this.reservation.serviceIds
    };

    this.clientService.createReservation(reservationData).subscribe({
      next: () => {
        loading.dismiss();
        this.submitting = false;
        this.presentToast('Réservation créée avec succès', 'success');
        this.router.navigate(['/client/dashboard']);
      },
      error: (error) => {
        console.error('Error creating reservation', error);
        loading.dismiss();
        this.submitting = false;
        this.presentToast('Erreur lors de la création de la réservation', 'danger');
      }
    });
  }

  validateForm(): boolean {
    if (!this.reservation.date) {
      this.presentToast('Veuillez sélectionner une date', 'warning');
      return false;
    }
    if (!this.reservation.time) {
      this.presentToast('Veuillez sélectionner une heure', 'warning');
      return false;
    }
    if (!this.reservation.location) {
      this.presentToast('Veuillez entrer un lieu', 'warning');
      return false;
    }
    if (!this.reservation.petId) {
      this.presentToast('Veuillez sélectionner un animal', 'warning');
      return false;
    }
    if (this.reservation.serviceIds.length === 0) {
      this.presentToast('Veuillez sélectionner au moins un service', 'warning');
      return false;
    }
    return true;
  }

  async presentToast(message: string, color: 'success' | 'danger' | 'warning') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'bottom'
    });
    await toast.present();
  }
}