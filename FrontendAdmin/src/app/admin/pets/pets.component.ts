import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PetService, Pet } from './pet.service';
import { finalize } from 'rxjs/operators';


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
  
  // Make Math available to the template
  Math = Math;

  constructor(private petService: PetService) { }

  ngOnInit(): void {
    this.loadPets();
  }

  loadPets(): void {
    this.loading = true;
    this.error = '';
    
    this.petService.getPets()
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (pets) => {
          this.pets = pets;
          this.totalItems = pets.length;
        },
        error: (err) => {
          console.error('Error loading pets:', err);
          this.error = 'Failed to load pets. Please try again later.';
        }
      });
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

  deletePet(id: number): void {
    if (confirm('Are you sure you want to delete this pet?')) {
      this.loading = true;
      this.petService.deletePet(id)
        .pipe(
          finalize(() => this.loading = false)
        )
        .subscribe({
          next: () => {
            this.loadPets();
          },
          error: (err) => {
            console.error('Error deleting pet:', err);
            this.error = 'Failed to delete pet. Please try again later.';
          }
        });
    }
  }
}