import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../shared/api.service';

@Injectable({ providedIn: 'root' })
export class ProviderService {
  constructor(private apiService: ApiService) {}

  getServices(): Observable<any[]> {
    return this.apiService.get<any[]>('provider/services');
  }

  getAppointments(): Observable<any[]> {
    return this.apiService.get<any[]>('provider/appointments');
  }
}
