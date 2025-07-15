import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface PetService {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  category: string;
  status: 'active' | 'inactive';
}

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ServicesComponent implements OnInit {
  services: PetService[] = [];
  loading = true;
  error = '';
  
  // For pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  
  // For filtering
  searchTerm = '';
  categoryFilter = 'all';
  statusFilter = 'all';
  
  // Make Math available to the template
  Math = Math;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.loading = true;
    
    // In a real application, you would call your API with pagination, filtering, etc.
    // For now, we'll simulate this with mock data
    setTimeout(() => {
      this.services = this.getMockServices();
      this.totalItems = this.services.length;
      this.loading = false;
    }, 800);
  }

  getMockServices(): PetService[] {
    return [
      { id: 1, name: 'Basic Grooming', description: 'Basic grooming service including bath and brush', price: 35, duration: 60, category: 'Grooming', status: 'active' },
      { id: 2, name: 'Full Grooming', description: 'Complete grooming service including bath, brush, haircut, and nail trimming', price: 65, duration: 90, category: 'Grooming', status: 'active' },
      { id: 3, name: 'Nail Trimming', description: 'Nail trimming service for dogs and cats', price: 15, duration: 15, category: 'Grooming', status: 'active' },
      { id: 4, name: 'Teeth Cleaning', description: 'Dental cleaning service for pets', price: 45, duration: 30, category: 'Health', status: 'active' },
      { id: 5, name: 'Vaccination', description: 'Essential vaccinations for pets', price: 50, duration: 20, category: 'Health', status: 'active' },
      { id: 6, name: 'Microchipping', description: 'Microchipping service for pet identification', price: 40, duration: 15, category: 'Health', status: 'inactive' },
      { id: 7, name: 'Pet Boarding', description: 'Overnight boarding service for pets', price: 35, duration: 1440, category: 'Boarding', status: 'active' },
      { id: 8, name: 'Pet Daycare', description: 'Daytime care service for pets', price: 25, duration: 480, category: 'Boarding', status: 'active' },
    ];
  }

  onSearch(): void {
    this.loadServices();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadServices();
  }

  onCategoryFilterChange(category: string): void {
    this.categoryFilter = category;
    this.loadServices();
  }

  onStatusFilterChange(status: string): void {
    this.statusFilter = status;
    this.loadServices();
  }

  deleteService(id: number): void {
    // In a real application, you would call your API to delete the service
    // For now, we'll just filter out the service from our local array
    if (confirm('Are you sure you want to delete this service?')) {
      this.services = this.services.filter(service => service.id !== id);
      this.totalItems = this.services.length;
    }
  }

  formatDuration(minutes: number): string {
    if (minutes < 60) {
      return `${minutes} min`;
    } else if (minutes === 60) {
      return '1 hour';
    } else if (minutes < 1440) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 ? `${hours} hr ${remainingMinutes} min` : `${hours} hr`;
    } else {
      const days = Math.floor(minutes / 1440);
      return days === 1 ? '1 day' : `${days} days`;
    }
  }
}