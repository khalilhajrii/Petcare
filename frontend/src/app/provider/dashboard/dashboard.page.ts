import { Component, OnInit } from '@angular/core';
import { ProviderService } from '../provider.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  standalone: false,
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  services: any[] = [];
  appointments: any[] = [];

  constructor(private providerService: ProviderService, private auth: AuthService) {}

  ngOnInit() {
    this.loadServices();
    this.loadAppointments();
  }

  loadServices() {
    this.providerService.getServices().subscribe(services => this.services = services);
  }

  loadAppointments() {
    this.providerService.getAppointments().subscribe(appts => this.appointments = appts);
  }

  logout() {
    this.auth.logout();
  }
}
