import { Component } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router, RouterModule } from '@angular/router';
import { ToastController, LoadingController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule, RouterModule],
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async login() {
    console.log('LoginPage.login() called', this.loginForm.value);
    if (this.loginForm.invalid) return;

    const loading = await this.loadingCtrl.create({
      message: 'Authenticating...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      await lastValueFrom(
        this.auth.login(
          this.loginForm.value.email,
          this.loginForm.value.password
        )
      );

      const toast = await this.toastCtrl.create({
        message: 'Login successful!',
        duration: 2000,
        color: 'success',
        position: 'top'
      });
      await toast.present();
    } catch (error) {
      let errorMessage = 'Login failed';
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
