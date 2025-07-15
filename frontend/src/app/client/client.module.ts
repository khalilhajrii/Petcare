import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardPage } from './dashboard/dashboard.page';
import { ClientLayoutComponent } from './client-layout/client-layout.component';

const routes: Routes = [
  {
    path: '',
    component: ClientLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardPage },
      { path: 'profile', loadComponent: () => import('./profile/profile.page').then(m => m.ProfilePage) },
      { path: 'pets', loadComponent: () => import('./pets/pets.page').then(m => m.PetsPage) },
      { path: 'pets/new', loadComponent: () => import('./pets/pet-detail/pet-detail.page').then(m => m.PetDetailPage) },
      { path: 'pets/:id', loadComponent: () => import('./pets/pet-detail/pet-detail.page').then(m => m.PetDetailPage) },
      { path: 'services', loadComponent: () => import('./services/services.page').then(m => m.ServicesPage) }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  declarations: []
})
export class ClientModule { }
