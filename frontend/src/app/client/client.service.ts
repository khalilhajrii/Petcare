import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiService } from '../shared/api.service';
import { User } from '../models/user.model';
import { Pet } from '../models/pet.model';
// Remove appointment model import as it doesn't exist

@Injectable({ providedIn: 'root' })
export class ClientService {
  constructor(private apiService: ApiService) {}

  // User profile methods
  getUserProfile(): Observable<User> {
    console.log('Requesting user profile from API');
    return this.apiService.get<User>('users/profile').pipe(
      map(response => {
        console.log('User profile response:', response);
        return response;
      }),
      catchError(error => {
        console.error('Error fetching user profile:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
        console.error('Error details:', error.error);
        throw error;
      })
    );
  }

  updateUserProfile(userData: Partial<User>): Observable<User> {
    console.log('Updating user profile with data:', userData);
    return this.apiService.put<User>('users/profile', userData).pipe(
      map(response => {
        console.log('User profile update response:', response);
        return response;
      }),
      catchError(error => {
        console.error('Error updating user profile:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
        console.error('Error details:', error.error);
        throw error;
      })
    );
  }

  // Pet methods
  getPets(): Observable<Pet[]> {
    // Get userId from localStorage or from the user object in storage service
    const userId = localStorage.getItem('userId');
    
    // If userId is null, try to get the user from the current user in auth service
    if (!userId) {
      // Return empty array if no userId is available
      console.error('No userId found in localStorage');
      return new Observable<Pet[]>(observer => {
        observer.next([]);
        observer.complete();
      });
    }
    
    return this.apiService.get<Pet[]>(`pets/user/${userId}/with-vaccinations`);
  }

  getPet(id: number): Observable<Pet> {
    return this.apiService.get<Pet>(`pets/${id}`);
  }

  createPet(pet: Partial<Pet>): Observable<Pet> {
    return this.apiService.post<Pet>('pets', pet);
  }

  updatePet(id: number, pet: Partial<Pet>): Observable<Pet> {
    return this.apiService.put<Pet>(`pets/${id}`, pet);
  }

  deletePet(id: number): Observable<void> {
    return this.apiService.delete<void>(`pets/${id}`);
  }

  // Appointment methods
  getAppointments(): Observable<any[]> {
    console.log('Requesting appointments from API');
    return this.apiService.get<any[]>('client/appointments').pipe(
      map(response => {
        console.log('Appointments response:', response);
        return response;
      }),
      catchError(error => {
        console.error('Error fetching appointments:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
        console.error('Error details:', error.error);
        throw error;
      })
    );
  }

  // Services methods
  getServices(): Observable<any[]> {
    return this.apiService.get<any[]>('services');
  }

  // Reservation methods
  createReservation(reservationData: any): Observable<any> {
    console.log('Creating reservation with data:', reservationData);
    return this.apiService.post<any>('reservations', reservationData).pipe(
      map(response => {
        console.log('Reservation created successfully:', response);
        return response;
      }),
      catchError(error => {
        console.error('Error creating reservation:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
        console.error('Error details:', error.error);
        throw error;
      })
    );
  }
}
