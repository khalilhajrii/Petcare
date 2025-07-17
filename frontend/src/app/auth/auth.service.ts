import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

import { StorageService } from '../shared/storage.service';
import { Router } from '@angular/router';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  private _storageService: StorageService;
  private authInitialized = false;
  private authInitializedPromise: Promise<boolean>;

  constructor(
    private http: HttpClient,
    storageService: StorageService,
    private router: Router
  ) {
    this._storageService = storageService;
    this.authInitializedPromise = this.initStorage();
  }

  async initStorage(): Promise<boolean> {
    try {
      console.log('Initializing auth from storage...');
      const token = await this._storageService.get('token');
      const user = await this._storageService.get('user');
      
      if (user && token) {
        console.log('Found user and token in storage, restoring session');
        this.currentUserSubject.next(user);
      } else {
        console.log('No valid auth data found in storage');
      }
      
      this.authInitialized = true;
      return true;
    } catch (error) {
      console.error('Error initializing auth from storage:', error);
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
    console.log('Login attempt with email:', email);
    return this.http.post(`${environment.apiUrl}/auth/login`, { email, password }).pipe(
      tap(async (response: any) => {
        console.log('Login response:', response);
        console.log('Access token received:', response.access_token);
        
        try {
          // Store token in Ionic Storage
          await this._storageService.set('token', response.access_token);
          console.log('Token stored in Ionic Storage');
          
          // Verify token was stored correctly
          const storedToken = await this._storageService.get('token');
          console.log('Verified stored token:', storedToken);
          
          // Store user in Ionic Storage
          await this._storageService.set('user', response.user);
          console.log('User stored in Ionic Storage');
          
          // Store email in Ionic Storage for chatbot and other services
          if (response.user && response.user.email) {
            console.log('Setting email in storage:', response.user.email);
            await this._storageService.set('email', response.user.email);
          }
          
          // Store userId in localStorage for easy access
          if (response.user && response.user.id) {
            console.log('Setting userId in localStorage:', response.user.id);
            localStorage.setItem('userId', response.user.id.toString());
          }
          
          this.currentUserSubject.next(response.user);
          this.redirectBasedOnRole(response.user.role);
        } catch (error) {
          console.error('Error storing auth data:', error);
        }
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/register`, userData).pipe(
      tap(async (response: any) => {
        await this._storageService.set('token', response.access_token);
        await this._storageService.set('user', response.user);
        
        // Store email in Ionic Storage for chatbot and other services
        if (response.user && response.user.email) {
          console.log('Setting email in storage:', response.user.email);
          await this._storageService.set('email', response.user.email);
        }
        
        // Store userId in localStorage for easy access
        if (response.user && response.user.id) {
          localStorage.setItem('userId', response.user.id.toString());
        }
        
        this.currentUserSubject.next(response.user);
        this.redirectBasedOnRole(response.user.role);
      })
    );
  }

  private redirectBasedOnRole(role: any) {
    // role can be a string or an object with roleName
    const roleName = typeof role === 'string' ? role : role?.roleName;
    console.log('Redirecting based on role:', role, 'roleName:', roleName);
    let route = '/login';
    
    // Handle both string role names and role objects
    if (roleName === 'client' || roleName === 'user') {
      route = '/client';
    } else if (roleName === 'prestataire' || roleName === 'professional' || roleName === 'veterinarian') {
      route = '/provider/dashboard';
    } else {
      console.warn('Unknown role:', roleName);
    }
    
    this.router.navigate([route]);
  }

  async logout() {
    console.log('Logging out user');
    await this._storageService.remove('token');
    await this._storageService.remove('user');
    await this._storageService.remove('email');
    
    // Clear userId from localStorage
    localStorage.removeItem('userId');
    console.log('Cleared userId from localStorage');
    
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
    console.log('Redirected to login page');
  }
}

