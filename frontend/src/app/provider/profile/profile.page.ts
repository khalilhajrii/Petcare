import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProviderService } from '../provider.service';
import { ToastController, LoadingController, IonicModule } from '@ionic/angular';
import { User } from '../../models/user.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule, RouterModule]
})
export class ProfilePage implements OnInit {
  profileForm: FormGroup;
  user: User = {} as User;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private providerService: ProviderService,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {
    this.profileForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: [{ value: '', disabled: true }],
      phone: [''],
      address: ['', Validators.required],
      disponibilite: [false]
    });
  }

  ngOnInit() {
    this.loadUserProfile();
  }

  async loadUserProfile() {
    const loading = await this.loadingController.create({
      message: 'Chargement du profil...'
    });
    await loading.present();
    this.isLoading = true;

    this.providerService.getUserProfile().subscribe({
      next: (user) => {
        this.user = user;
        this.profileForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone || '',
          address: user.address,
          disponibilite: user.disponibilite
        });
        this.isLoading = false;
        loading.dismiss();
      },
      error: (error) => {
        console.error('Error loading profile', error);
        this.showToast('Erreur lors du chargement du profil');
        this.isLoading = false;
        loading.dismiss();
      }
    });
  }

  async updateProfile() {
    if (this.profileForm.invalid) {
      this.showToast('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Mise à jour du profil...'
    });
    await loading.present();

    const userData = {
      firstName: this.profileForm.get('firstName')?.value || '',
      lastName: this.profileForm.get('lastName')?.value || '',
      phone: this.profileForm.get('phone')?.value || '',
      address: this.profileForm.get('address')?.value || '',
      disponibilite: this.profileForm.get('disponibilite')?.value
    };

    this.providerService.updateUserProfile(userData).subscribe({
      next: (updatedUser) => {
        this.user = updatedUser;
        this.showToast('Profil mis à jour avec succès');
        loading.dismiss();
      },
      error: (error) => {
        console.error('Error updating profile', error);
        this.showToast('Erreur lors de la mise à jour du profil');
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