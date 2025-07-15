import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  address: string;
  isActive: boolean;
  disponibilite: boolean;
  role: {
    id: number;
    roleName: string;
  };
  roleId: number;
}

export interface Role {
  id: number;
  roleName: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;
  private rolesUrl = `${environment.apiUrl}/roles`;

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  createUser(user: Omit<User, 'id'>): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/auth/register`, user);
  }

  updateUser(id: number, user: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(this.rolesUrl);
  }
}