import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProviderService, Service } from '../provider.service';
import { ToastController, LoadingController, AlertController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-services',
  templateUrl: './services.page.html',
  styleUrls: ['./services.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule, RouterModule]
})
export class ServicesPage implements OnInit {
  services: Service[] = [];
  isLoading = false;
  showServiceForm = false;
  isEditMode = false;
  currentServiceId: number | null | undefined = null;
  serviceForm: FormGroup;

  constructor(
    private providerService: ProviderService,
    private formBuilder: FormBuilder,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {
    this.serviceForm = this.formBuilder.group({
      nomservice: ['', [Validators.required, Validators.minLength(3)]],
      prixService: ['', [Validators.required, Validators.min(0)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      servicedetail: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.loadServices();
  }

  async loadServices() {
    this.isLoading = true;
    const loading = await this.loadingController.create({
      message: 'Chargement des services...'
    });
    await loading.present();

    this.providerService.getServices().subscribe({
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

  toggleServiceForm() {
    this.showServiceForm = !this.showServiceForm;
    if (!this.showServiceForm) {
      this.resetForm();
    }
  }

  resetForm() {
    this.serviceForm.reset();
    this.isEditMode = false;
    this.currentServiceId = null;
  }

  async editService(service: Service) {
    this.isEditMode = true;
    this.currentServiceId = service.idservice;
    this.serviceForm.patchValue({
      nomservice: service.nomservice,
      prixService: service.prixService,
      description: service.description,
      servicedetail: service.servicedetail
    });
    this.showServiceForm = true;
  }

  async saveService() {
    if (this.serviceForm.invalid) {
      this.showToast('Veuillez remplir correctement tous les champs');
      return;
    }

    const loading = await this.loadingController.create({
      message: this.isEditMode ? 'Mise à jour du service...' : 'Création du service...'
    });
    await loading.present();

    const serviceData: Service = {
      nomservice: this.serviceForm.get('nomservice')?.value,
      prixService: this.serviceForm.get('prixService')?.value,
      description: this.serviceForm.get('description')?.value,
      servicedetail: this.serviceForm.get('servicedetail')?.value
    };

    if (this.isEditMode && this.currentServiceId) {
      this.providerService.updateService(this.currentServiceId, serviceData).subscribe({
        next: () => {
          this.showToast('Service mis à jour avec succès');
          this.loadServices();
          this.resetForm();
          this.showServiceForm = false;
          loading.dismiss();
        },
        error: (error) => {
          console.error('Error updating service', error);
          this.showToast('Erreur lors de la mise à jour du service');
          loading.dismiss();
        }
      });
    } else {
      this.providerService.createService(serviceData).subscribe({
        next: () => {
          this.showToast('Service créé avec succès');
          this.loadServices();
          this.resetForm();
          this.showServiceForm = false;
          loading.dismiss();
        },
        error: (error) => {
          console.error('Error creating service', error);
          this.showToast('Erreur lors de la création du service');
          loading.dismiss();
        }
      });
    }
  }

  async confirmDelete(service: Service) {
    const alert = await this.alertController.create({
      header: 'Confirmation',
      message: `Êtes-vous sûr de vouloir supprimer le service "${service.nomservice}" ?`,
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel'
        },
        {
          text: 'Supprimer',
          role: 'destructive',
          handler: () => {
            this.deleteService(service);
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteService(service: Service) {
    if (!service.idservice) {
      this.showToast('ID de service invalide');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Suppression du service...'
    });
    await loading.present();

    this.providerService.deleteService(service.idservice).subscribe({
      next: () => {
        this.showToast('Service supprimé avec succès');
        this.loadServices();
        loading.dismiss();
      },
      error: (error) => {
        console.error('Error deleting service', error);
        this.showToast('Erreur lors de la suppression du service');
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