import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { environment } from 'src/environments/environment';
import { from, map, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(
    private http: HttpClient,
    private storage: StorageService
  ) {}

  private getAuthHeaders() {
    return from(this.storage.get('token')).pipe(
      map(token => new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }))
    );
  }

  get<T>(endpoint: string) {
    return this.getAuthHeaders().pipe(
      switchMap(headers => this.http.get<T>(`${environment.apiUrl}/${endpoint}`, { headers }))
    );
  }

  post<T>(endpoint: string, body: any) {
    return this.getAuthHeaders().pipe(
      switchMap(headers => this.http.post<T>(`${environment.apiUrl}/${endpoint}`, body, { headers }))
    );
  }
}
