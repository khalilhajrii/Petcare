import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { environment } from 'src/environments/environment';
import { from, of, map, switchMap, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(
    private http: HttpClient,
    private storage: StorageService
  ) {}

  private getAuthHeaders() {
    console.log('Getting auth headers for API request');
    return from(this.storage.ensureInitialized()).pipe(
      switchMap(() => from(this.storage.get('token'))),
      map(token => {
        console.log('Using auth token:', token);
        if (!token) {
          console.error('No token found in storage! Authentication will fail.');
          console.log('Storage state may not be properly initialized or token was not saved during login');
        }
        
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        });
        
        console.log('Authorization header:', headers.get('Authorization'));
        return headers;
      }),
      catchError(error => {
        console.error('Error getting auth headers:', error);
        // Return default headers without auth token in case of error
        return of(new HttpHeaders({
          'Content-Type': 'application/json'
        }));
      })
    );
  }

  get<T>(endpoint: string) {
    const url = `${environment.apiUrl}/${endpoint}`;
    console.log(`GET request to: ${url}`);
    return this.getAuthHeaders().pipe(
      switchMap(headers => {
        return this.http.get<T>(url, { headers }).pipe(
          map(response => {
            console.log(`GET response from ${url}:`, response);
            return response;
          }),
          catchError(error => {
            console.error(`GET error from ${url}:`, error);
            console.error('Error status:', error.status);
            console.error('Error message:', error.message);
            console.error('Error details:', error.error);
            throw error;
          })
        );
      })
    );
  }

  post<T>(endpoint: string, body: any) {
    const url = `${environment.apiUrl}/${endpoint}`;
    console.log(`POST request to: ${url}`, body);
    return this.getAuthHeaders().pipe(
      switchMap(headers => {
        console.log('Headers for POST request:', headers);
        return this.http.post<T>(url, body, { headers }).pipe(
          map(response => {
            console.log(`POST response from ${url}:`, response);
            return response;
          }),
          catchError(error => {
            console.error(`POST error from ${url}:`, error);
            console.error('Error status:', error.status);
            console.error('Error message:', error.message);
            console.error('Error details:', error.error);
            throw error;
          })
        );
      })
    );
  }

  put<T>(endpoint: string, body: any) {
    const url = `${environment.apiUrl}/${endpoint}`;
    console.log(`PUT request to: ${url}`, body);
    return this.getAuthHeaders().pipe(
      switchMap(headers => {
        console.log('Headers for PUT request:', headers);
        return this.http.put<T>(url, body, { headers }).pipe(
          map(response => {
            console.log(`PUT response from ${url}:`, response);
            return response;
          }),
          catchError(error => {
            console.error(`PUT error from ${url}:`, error);
            console.error('Error status:', error.status);
            console.error('Error message:', error.message);
            console.error('Error details:', error.error);
            throw error;
          })
        );
      })
    );
  }

  delete<T>(endpoint: string) {
    const url = `${environment.apiUrl}/${endpoint}`;
    console.log(`DELETE request to: ${url}`);
    return this.getAuthHeaders().pipe(
      switchMap(headers => {
        console.log('Headers for DELETE request:', headers);
        return this.http.delete<T>(url, { headers }).pipe(
          map(response => {
            console.log(`DELETE response from ${url}:`, response);
            return response;
          }),
          catchError(error => {
            console.error(`DELETE error from ${url}:`, error);
            console.error('Error status:', error.status);
            console.error('Error message:', error.message);
            console.error('Error details:', error.error);
            throw error;
          })
        );
      })
    );
  }

  patch<T>(endpoint: string, body: any) {
    const url = `${environment.apiUrl}/${endpoint}`;
    console.log(`PATCH request to: ${url}`, body);
    return this.getAuthHeaders().pipe(
      switchMap(headers => {
        console.log('Headers for PATCH request:', headers);
        return this.http.patch<T>(url, body, { headers }).pipe(
          map(response => {
            console.log(`PATCH response from ${url}:`, response);
            return response;
          }),
          catchError(error => {
            console.error(`PATCH error from ${url}:`, error);
            console.error('Error status:', error.status);
            console.error('Error message:', error.message);
            console.error('Error details:', error.error);
            throw error;
          })
        );
      })
    );
  }
}
