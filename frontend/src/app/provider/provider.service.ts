import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProviderService {
  constructor(private http: HttpClient) {}

  getServices(): Observable<any[]> {
    return this.http.get<any[]>('/api/provider/services');
  }

  getAppointments(): Observable<any[]> {
    return this.http.get<any[]>('/api/provider/appointments');
  }
}
