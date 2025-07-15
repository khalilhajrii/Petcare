import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServiceService, Service } from './service.service';
import { finalize } from 'rxjs/operators';


@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ServicesComponent implements OnInit {
  services: Service[] = [];
  loading = true;
  error = '';
  
  // For pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  
  // For filtering
  searchTerm = '';
  categoryFilter = 'all';
  
  // Make Math available to the template
  Math = Math;

  constructor(private serviceService: ServiceService) { }

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.loading = true;
    this.error = '';
    
    this.serviceService.getServices()
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (data) => {
          this.services = data;
          this.totalItems = this.services.length;
        },
        error: (err) => {
          console.error('Error loading services', err);
          this.error = 'Failed to load services. Please try again later.';
        }
      });
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



  deleteService(id: number): void {
    if (confirm('Are you sure you want to delete this service?')) {
      this.loading = true;
      this.error = '';
      
      this.serviceService.deleteService(id)
        .pipe(
          finalize(() => this.loading = false)
        )
        .subscribe({
          next: () => {
            this.services = this.services.filter(service => service.idservice !== id);
            this.totalItems = this.services.length;
          },
          error: (err) => {
            console.error('Error deleting service', err);
            this.error = 'Failed to delete service. Please try again later.';
          }
        });
    }
  }


}