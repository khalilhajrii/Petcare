import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Pet {
  id: number;
  name: string;
  type: string;
  breed: string;
  age: number;
  ownerId: number;
  ownerName: string;
  status: 'active' | 'inactive';
}

@Component({
  selector: 'app-pets',
  templateUrl: './pets.component.html',
  styleUrls: ['./pets.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class PetsComponent implements OnInit {
  pets: Pet[] = [];
  loading = true;
  error = '';
  
  // For pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  
  // For filtering
  searchTerm = '';
  typeFilter = 'all';
  statusFilter = 'all';
  
  // Make Math available to the template
  Math = Math;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadPets();
  }

  loadPets(): void {
    this.loading = true;
    
    // In a real application, you would call your API with pagination, filtering, etc.
    // For now, we'll simulate this with mock data
    setTimeout(() => {
      this.pets = this.getMockPets();
      this.totalItems = this.pets.length;
      this.loading = false;
    }, 800);
  }

  getMockPets(): Pet[] {
    return [
      { id: 1, name: 'Max', type: 'Dog', breed: 'Golden Retriever', age: 3, ownerId: 2, ownerName: 'Jane Smith', status: 'active' },
      { id: 2, name: 'Bella', type: 'Cat', breed: 'Siamese', age: 2, ownerId: 3, ownerName: 'Robert Johnson', status: 'active' },
      { id: 3, name: 'Charlie', type: 'Dog', breed: 'Beagle', age: 4, ownerId: 4, ownerName: 'Emily Davis', status: 'inactive' },
      { id: 4, name: 'Luna', type: 'Cat', breed: 'Persian', age: 1, ownerId: 5, ownerName: 'Michael Wilson', status: 'active' },
      { id: 5, name: 'Cooper', type: 'Dog', breed: 'Labrador', age: 5, ownerId: 6, ownerName: 'Sarah Brown', status: 'active' },
      { id: 6, name: 'Lucy', type: 'Cat', breed: 'Maine Coon', age: 3, ownerId: 7, ownerName: 'David Miller', status: 'inactive' },
      { id: 7, name: 'Bailey', type: 'Dog', breed: 'Poodle', age: 2, ownerId: 8, ownerName: 'Lisa Anderson', status: 'active' },
      { id: 8, name: 'Oliver', type: 'Cat', breed: 'Ragdoll', age: 4, ownerId: 2, ownerName: 'Jane Smith', status: 'active' },
    ];
  }

  onSearch(): void {
    this.loadPets();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadPets();
  }

  onTypeFilterChange(type: string): void {
    this.typeFilter = type;
    this.loadPets();
  }

  onStatusFilterChange(status: string): void {
    this.statusFilter = status;
    this.loadPets();
  }

  deletePet(id: number): void {
    // In a real application, you would call your API to delete the pet
    // For now, we'll just filter out the pet from our local array
    if (confirm('Are you sure you want to delete this pet?')) {
      this.pets = this.pets.filter(pet => pet.id !== id);
      this.totalItems = this.pets.length;
    }
  }
}