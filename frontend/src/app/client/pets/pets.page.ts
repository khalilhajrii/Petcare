import { Component, OnInit } from '@angular/core';
import { ClientService } from '../client.service';
import { Pet } from '../../models/pet.model';
import { ToastController, AlertController, LoadingController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-pets',
  templateUrl: './pets.page.html',
  styleUrls: ['./pets.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule]
})
export class PetsPage implements OnInit {
  pets: Pet[] = [];
  isLoading = false;

  constructor(
    private clientService: ClientService,
    private toastController: ToastController,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.loadPets();
  }

  async loadPets() {
    this.isLoading = true;
    const loading = await this.loadingController.create({
      message: 'Chargement des animaux...'
    });
    await loading.present();

    this.clientService.getPets().subscribe({
      next: (pets) => {
        this.pets = pets;
        this.isLoading = false;
        loading.dismiss();
      },
      error: (error) => {
        console.error('Error loading pets', error);
        this.showToast('Erreur lors du chargement des animaux');
        this.isLoading = false;
        loading.dismiss();
      }
    });
  }

  async confirmDelete(pet: Pet) {
    const alert = await this.alertController.create({
      header: 'Confirmer la suppression',
      message: `Êtes-vous sûr de vouloir supprimer ${pet.nom}?`,
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel'
        },
        {
          text: 'Supprimer',
          handler: () => {
            this.deletePet(pet.idPet);
          }
        }
      ]
    });

    await alert.present();
  }

  async deletePet(id: number) {
    const loading = await this.loadingController.create({
      message: 'Suppression en cours...'
    });
    await loading.present();

    this.clientService.deletePet(id).subscribe({
      next: () => {
        this.pets = this.pets.filter(p => p.idPet !== id);
        this.showToast('Animal supprimé avec succès');
        loading.dismiss();
      },
      error: (error) => {
        console.error('Error deleting pet', error);
        this.showToast('Erreur lors de la suppression de l\'animal');
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