import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Role, UserService } from '../users/user.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class RolesComponent implements OnInit {
  roles: Role[] = [];
  loading = true;
  error = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.loading = true;
    this.error = '';
    
    this.userService.getRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading roles:', err);
        this.error = 'Failed to load roles. Please try again.';
        this.loading = false;
      }
    });
  }
}