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

  constructor(
    private http: HttpClient,
    storageService: StorageService,
    private router: Router
  ) {
    this._storageService = storageService;
    this.initStorage();
  }

  async initStorage() {
    let user = await this._storageService.get('user');
    if (user) this.currentUserSubject.next(user);
  }

  get currentUser$(): Observable<any> {
    return this.currentUserSubject.asObservable();
  }

  get currentUserValue() {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): Observable<any> {
    console.log('AuthService.login called', email, password);
    return this.http.post(`${environment.apiUrl}/auth/login`, { email, password }).pipe(
      tap(async (response: any) => {
        console.log('AuthService.login response', response);
        await this._storageService.set('token', response.access_token);
        await this._storageService.set('user', response.user);
        this.currentUserSubject.next(response.user);
        this.redirectBasedOnRole(response.user.role);
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/register`, userData).pipe(
      tap(async (response: any) => {
        await this._storageService.set('token', response.access_token);
        await this._storageService.set('user', response.user);
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
    if (roleName === 'client') {
      route = '/client';
    } else if (roleName === 'prestataire') {
      route = '/provider/dashboard';
    } else if (roleName === 'admin') {
      route = '/admin/dashboard';
    }
    this.router.navigate([route]);
  }

  async logout() {
    await this._storageService.remove('token');
    await this._storageService.remove('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
}

