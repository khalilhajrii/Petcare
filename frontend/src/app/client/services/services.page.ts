import { Component, OnInit } from '@angular/core';
import { ClientService } from '../client.service';
import { ToastController, LoadingController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-services',
  templateUrl: './services.page.html',
  styleUrls: ['./services.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule]
})
export class ServicesPage implements OnInit {
  services: any[] = [];
  isLoading = false;

  constructor(
    private clientService: ClientService,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.loadServices();
  }

  async loadServices() {
    this.isLoading = true;
    const loading = await this.loadingController.create({
      message: 'Chargement des services...'
    });
    await loading.present();

    // Nous devons ajouter cette méthode au service client
    this.clientService.getServices().subscribe({
      next: (services) => {
        this.services = services;
        this.isLoading = false;
        loading.dismiss();
      },
      error: (error) => {
        console.error('Error loading services', error);
        this.showToast('Erreur lors du chargement des services');
        this.isLoading = false;
        loading.dismiss();
      }
    });
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }
}