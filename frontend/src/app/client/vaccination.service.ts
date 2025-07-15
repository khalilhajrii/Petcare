import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../shared/api.service';
import { VaccinationRecord } from '../models/vaccination-record.model';

@Injectable({
  providedIn: 'root'
})
export class VaccinationService {
  constructor(private apiService: ApiService) {}

  // Get all vaccination records
  getAllVaccinationRecords(): Observable<VaccinationRecord[]> {
    return this.apiService.get<VaccinationRecord[]>('vaccination-records');
  }

  // Get vaccination records for a specific pet
  getVaccinationRecordsByPet(petId: number): Observable<VaccinationRecord[]> {
    return this.apiService.get<VaccinationRecord[]>(`vaccination-records/pet/${petId}`);
  }

  // Get a specific vaccination record
  getVaccinationRecord(id: number): Observable<VaccinationRecord> {
    return this.apiService.get<VaccinationRecord>(`vaccination-records/${id}`);
  }

  // Create a new vaccination record
  createVaccinationRecord(record: Partial<VaccinationRecord>): Observable<VaccinationRecord> {
    return this.apiService.post<VaccinationRecord>('vaccination-records', record);
  }

  // Update a vaccination record
  updateVaccinationRecord(id: number, record: Partial<VaccinationRecord>): Observable<VaccinationRecord> {
    return this.apiService.put<VaccinationRecord>(`vaccination-records/${id}`, record);
  }

  // Delete a vaccination record
  deleteVaccinationRecord(id: number): Observable<void> {
    return this.apiService.delete<void>(`vaccination-records/${id}`);
  }
}