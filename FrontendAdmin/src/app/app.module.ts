import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { routes } from './app.routes';

// Auth Components
import { LoginComponent } from './auth/login/login.component';

// Admin Components
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { AdminLayoutComponent } from './admin/layout/admin-layout/admin-layout.component';
import { SidebarComponent } from './admin/layout/sidebar/sidebar.component';
import { UsersComponent } from './admin/users/users.component';
import { PetsComponent } from './admin/pets/pets.component';
import { ServicesComponent } from './admin/services/services.component';

// Services
import { AuthService } from './auth/auth.service';
import { StorageService } from './shared/storage.service';

// Guards
import { authGuard } from './auth/auth.guard';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    AuthService,
    StorageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }