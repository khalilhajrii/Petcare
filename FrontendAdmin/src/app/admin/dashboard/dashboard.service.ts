import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DashboardStats {
  users: number;
  pets: number;
  services: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getDashboardStats(): Observable<DashboardStats> {
    // Create observables for each API endpoint
    const users$ = this.http.get<any[]>(`${this.apiUrl}/users`);
    const pets$ = this.http.get<any[]>(`${this.apiUrl}/pets`);
    const services$ = this.http.get<any[]>(`${this.apiUrl}/services`);

    // Combine all observables and map the results to our stats object
    return forkJoin({
      users: users$,
      pets: pets$,
      services: services$
    }).pipe(
      map(results => ({
        users: results.users.length,
        pets: results.pets.length,
        services: results.services.length
      }))
    );
  }
}