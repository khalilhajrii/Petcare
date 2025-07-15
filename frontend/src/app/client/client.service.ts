import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ClientService {
  constructor(private http: HttpClient) {}

  getPets(): Observable<any[]> {
    return this.http.get<any[]>('/api/client/pets');
  }

  getAppointments(): Observable<any[]> {
    return this.http.get<any[]>('/api/client/appointments');
  }
}
