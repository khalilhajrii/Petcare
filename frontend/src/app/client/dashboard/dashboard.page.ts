import { Component, OnInit } from '@angular/core';
import { ClientService } from '../client.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  standalone: false,
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  pets: any[] = [];
  appointments: any[] = [];

  constructor(private clientService: ClientService, private auth: AuthService) {}

  ngOnInit() {
    this.loadPets();
    this.loadAppointments();
  }

  loadPets() {
    this.clientService.getPets().subscribe(pets => this.pets = pets);
  }

  loadAppointments() {
    this.clientService.getAppointments().subscribe(appts => this.appointments = appts);
  }

  logout() {
    this.auth.logout();
  }
}
