import { Component, OnInit } from '@angular/core';
import { ClientService } from '../client.service';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule],
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
