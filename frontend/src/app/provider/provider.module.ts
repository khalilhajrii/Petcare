import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardPage } from './dashboard/dashboard.page';
import { ProviderLayoutComponent } from './provider-layout/provider-layout.component';
import { ProfilePage } from './profile/profile.page';
import { ServicesPage } from './services/services.page';
import { ServiceReservationsPage } from './services/service-reservations/service-reservations.page';

const routes: Routes = [
  {
    path: '',
    component: ProviderLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardPage },
      { path: 'profile', component: ProfilePage },
      { path: 'services', component: ServicesPage },
      { path: 'services/reservations/:id', component: ServiceReservationsPage }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class ProviderModule {}