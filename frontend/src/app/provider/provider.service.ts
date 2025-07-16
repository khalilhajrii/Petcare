import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../shared/api.service';
import { User } from '../models/user.model';

export interface Service {
  idservice?: number;
  nomservice: string;
  prixService: number;
  description: string;
  servicedetail: string;
  userId?: number;
}

export interface Pet {
  id: number;
  name: string;
  species: string;
  breed: string;
}

export interface Reservation {
  idreserv: number;
  date: string;
  lieu: string;
  time: string;
  pet: Pet;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  services: Service[];
}

@Injectable({ providedIn: 'root' })
export class ProviderService {
  constructor(private apiService: ApiService) {}

  // User profile methods
  getUserProfile(): Observable<User> {
    return this.apiService.get<User>('users/profile');
  }

  updateUserProfile(userData: Partial<User>): Observable<User> {
    return this.apiService.put<User>('users/profile', userData);
  }

  // Services methods
  getServices(): Observable<Service[]> {
    return this.apiService.get<Service[]>('provider/services');
  }

  getServiceById(id: number): Observable<Service> {
    return this.apiService.get<Service>(`provider/services/${id}`);
  }

  createService(service: Service): Observable<Service> {
    return this.apiService.post<Service>('provider/services', service);
  }

  updateService(id: number, service: Partial<Service>): Observable<Service> {
    return this.apiService.put<Service>(`provider/services/${id}`, service);
  }

  deleteService(id: number): Observable<void> {
    return this.apiService.delete<void>(`provider/services/${id}`);
  }

  // Appointments/Reservations methods
  getAppointments(): Observable<any[]> {
    return this.apiService.get<any[]>('provider/appointments');
  }
  
  getReservations(): Observable<Reservation[]> {
    return this.apiService.get<Reservation[]>('reservations/provider');
  }
}
