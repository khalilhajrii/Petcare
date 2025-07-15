import { Component } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router, RouterModule } from '@angular/router';
import { LoadingController, ToastController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true, 
  imports: [CommonModule, IonicModule, ReactiveFormsModule, RouterModule],
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  registerForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: [''],
      address: ['', Validators.required],
      roleId: ['1', Validators.required]
    });
  }

  async register() {
    if (this.registerForm.invalid) return;

    const loading = await this.loadingCtrl.create({
      message: 'Creating account...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      await lastValueFrom(this.auth.register(this.registerForm.value));

      const toast = await this.toastCtrl.create({
        message: 'Account created successfully!',
        duration: 2000,
        color: 'success',
        position: 'top'
      });
      await toast.present();
    } catch (error) {
      let errorMessage = 'Registration failed';
      if (error && typeof error === 'object' && 'error' in error && error.error && typeof error.error === 'object' && 'message' in error.error) {
        errorMessage = (error.error as any).message || errorMessage;
      }
      const toast = await this.toastCtrl.create({
        message: errorMessage,
        duration: 3000,
        color: 'danger',
        position: 'top'
      });
      await toast.present();
    } finally {
      await loading.dismiss();
    }
  }
}
