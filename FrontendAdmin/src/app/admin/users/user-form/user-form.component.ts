import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Role, User, UserService } from '../user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class UserFormComponent implements OnInit {
  @Input() user: User | null = null;
  @Output() save = new EventEmitter<Partial<User>>();
  @Output() cancel = new EventEmitter<void>();

  userForm!: FormGroup;
  roles: Role[] = [];
  isSubmitting = false;
  formError = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadRoles();
    
    if (this.user) {
      this.userForm.patchValue({
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        email: this.user.email,
        phone: this.user.phone,
        address: this.user.address,
        isActive: this.user.isActive,
        disponibilite: this.user.disponibilite,
        roleId: this.user.roleId
      });
    }
  }

  private initForm(): void {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      address: [''],
      isActive: [true],
      disponibilite: [true],
      roleId: ['', [Validators.required]]
    });
  }

  private loadRoles(): void {
    this.userService.getRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
      },
      error: (error) => {
        console.error('Error loading roles:', error);
        this.formError = 'Failed to load roles. Please try again.';
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.formError = '';

    const userData = this.userForm.value;
    this.save.emit(userData);
  }

  onCancel(): void {
    this.cancel.emit();
  }
}