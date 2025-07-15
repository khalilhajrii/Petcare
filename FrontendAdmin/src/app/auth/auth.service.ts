import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { StorageService } from '../shared/storage.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  private authInitialized = false;
  private authInitializedPromise: Promise<boolean>;

  private http = inject(HttpClient);
  private storageService = inject(StorageService);
  private router = inject(Router);
  
  constructor() {
    this.authInitializedPromise = this.initStorage();
  }

  async initStorage(): Promise<boolean> {
    try {
      console.log('Initializing auth from storage...');
      const token = await this.storageService.get('admin_token');
      const user = await this.storageService.get('admin_user');
      
      if (user && token) {
        console.log('Found admin user and token in storage, restoring session');
        this.currentUserSubject.next(user);
      } else {
        console.log('No valid admin auth data found in storage');
      }
      
      this.authInitialized = true;
      return true;
    } catch (error) {
      console.error('Error initializing admin auth from storage:', error);
      this.authInitialized = true;
      return false;
    }
  }

  get currentUser$(): Observable<any> {
    return this.currentUserSubject.asObservable();
  }

  get currentUserValue() {
    return this.currentUserSubject.value;
  }
  
  /**
   * Returns a promise that resolves when auth initialization is complete
   * This is used by the auth guard to ensure auth state is loaded before checking
   */
  async waitForAuthInitialized(): Promise<boolean> {
    if (this.authInitialized) {
      return true;
    }
    return this.authInitializedPromise;
  }

  login(email: string, password: string): Observable<any> {
    console.log('Admin login attempt with email:', email);
    return this.http.post(`${environment.apiUrl}/auth/login`, { email, password }).pipe(
      tap(async (response: any) => {
        console.log('Admin login response:', response);
        
        try {
          // Check if user has admin role
          const userRole = typeof response.user.role === 'string' 
            ? response.user.role 
            : response.user.role?.roleName;
            
          if (userRole !== 'admin') {
            throw new Error('User is not an admin');
          }
          
          // Store token and user data
          await this.storageService.set('admin_token', response.access_token);
          await this.storageService.set('admin_user', response.user);
          
          this.currentUserSubject.next(response.user);
          this.router.navigate(['/admin/dashboard']);
        } catch (error) {
          console.error('Error storing admin auth data:', error);
          throw error;
        }
      })
    );
  }

  async logout() {
    console.log('Logging out admin user');
    await this.storageService.remove('admin_token');
    await this.storageService.remove('admin_user');
    
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
    console.log('Redirected to login page');
  }
}