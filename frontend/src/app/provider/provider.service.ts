import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from '../shared/api.service';
import { User } from '../models/user.model';
import { catchError, map } from 'rxjs/operators';

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
  status: string;
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
    console.log('Requesting all provider reservations');
    // Get userId from localStorage instead of relying on backend JWT extraction
    const userId = localStorage.getItem('userId');
    console.log('Using provider ID from localStorage:', userId);
    
    if (!userId) {
      console.error('No userId found in localStorage');
      return of([]);
    }
    
    // Use the provider/:id endpoint with the userId from localStorage
    return this.apiService.get<Reservation[]>(`reservations/provider/${userId}`).pipe(
      map(response => {
        console.log('Provider reservations response:', response);
        // Vérifier si la réponse est un tableau
        if (Array.isArray(response)) {
          return response;
        } else {
          console.error('La réponse n\'est pas un tableau:', response);
          return [];
        }
      }),
      catchError(error => {
        console.error('Error fetching provider reservations:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
        console.error('Error details:', error.error);
        // Retourner un tableau vide en cas d'erreur pour éviter de bloquer l'application
        return of([]);
      })
    );
  }

  getReservationsByServiceId(serviceId: number): Observable<Reservation[]> {
    console.log(`Requesting reservations for service ID: ${serviceId}`);
    return this.apiService.get<Reservation[]>(`reservations/service/${serviceId}`).pipe(
      map(response => {
        console.log('Service reservations response:', response);
        return response;
      }),
      catchError(error => {
        console.error(`Error fetching reservations for service ID ${serviceId}:`, error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
        console.error('Error details:', error.error);
        throw error;
      })
    );
  }

  updateReservationStatus(reservationId: number, status: string): Observable<Reservation> {
    console.log(`Updating reservation ID: ${reservationId} with status: ${status}`);
    return this.apiService.patch<Reservation>(`reservations/${reservationId}`, { status }).pipe(
      map(response => {
        console.log('Update reservation status response:', response);
        return response;
      }),
      catchError(error => {
        console.error(`Error updating reservation ID ${reservationId}:`, error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
        console.error('Error details:', error.error);
        throw error;
      })
    );
  }
}
