import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  loginError = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async login() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.loginError = '';

    try {
      await this.authService.login(
        this.loginForm.value.email,
        this.loginForm.value.password
      ).toPromise();
    } catch (error: any) {
      console.error('Login error:', error);
      this.loginError = error?.error?.message || 'Login failed. Please check your credentials.';
      
      if (error?.message === 'User is not an admin') {
        this.loginError = 'You do not have admin privileges.';
      }
    } finally {
      this.isLoading = false;
    }
  }
}