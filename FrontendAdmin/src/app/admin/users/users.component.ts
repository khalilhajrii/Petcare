import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User, UserService } from './user.service';
import { UserFormComponent } from './user-form/user-form.component';

interface UserViewModel {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  address: string;
  role: string;
  status: 'active' | 'inactive';
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, UserFormComponent]
})
export class UsersComponent implements OnInit {
  users: UserViewModel[] = [];
  loading = true;
  error = '';
  
  // For pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  
  // For filtering
  searchTerm = '';
  roleFilter = 'all';
  statusFilter = 'all';
  
  // For user form
  showUserForm = false;
  selectedUser: User | null = null;
  
  // Make Math available to the template
  Math = Math;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.error = '';
    
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users.map(user => ({
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          phone: user.phone,
          address: user.address,
          role: user.role.roleName,
          status: user.isActive ? 'active' : 'inactive'
        }));
        this.totalItems = this.users.length;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.error = 'Failed to load users. Please try again.';
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.loadUsers();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadUsers();
  }

  onRoleFilterChange(role: string): void {
    this.roleFilter = role;
    this.loadUsers();
  }

  onStatusFilterChange(status: string): void {
    this.statusFilter = status;
    this.loadUsers();
  }

  deleteUser(id: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.loading = true;
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (err) => {
          console.error('Error deleting user:', err);
          this.error = 'Failed to delete user. Please try again.';
          this.loading = false;
        }
      });
    }
  }

  openUserForm(user?: UserViewModel): void {
    if (user) {
      // Convert UserViewModel back to User
      this.userService.getUser(user.id).subscribe({
        next: (userData) => {
          this.selectedUser = userData;
          this.showUserForm = true;
        },
        error: (err) => {
          console.error('Error loading user details:', err);
          this.error = 'Failed to load user details. Please try again.';
        }
      });
    } else {
      // New user
      this.selectedUser = null;
      this.showUserForm = true;
    }
  }

  closeUserForm(): void {
    this.selectedUser = null;
    this.showUserForm = false;
  }

  saveUser(userData: Partial<User>): void {
    if (this.selectedUser) {
      // Update existing user
      this.userService.updateUser(this.selectedUser.id, userData).subscribe({
        next: () => {
          this.closeUserForm();
          this.loadUsers();
        },
        error: (err) => {
          console.error('Error updating user:', err);
          this.error = 'Failed to update user. Please try again.';
        }
      });
    } else {
      // Create new user
      this.userService.createUser(userData as Omit<User, 'id'>).subscribe({
        next: () => {
          this.closeUserForm();
          this.loadUsers();
        },
        error: (err) => {
          console.error('Error creating user:', err);
          this.error = 'Failed to create user. Please try again.';
        }
      });
    }
  }
}