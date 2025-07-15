import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class DashboardComponent implements OnInit {
  // Mock data for dashboard stats
  stats = {
    users: 0,
    pets: 0,
    services: 0
  };

  constructor() {}

  ngOnInit(): void {
    // In a real application, these would be fetched from an API
    this.loadMockData();
  }

  loadMockData(): void {
    // Simulate API call with mock data
    setTimeout(() => {
      this.stats = {
        users: 125,
        pets: 230,
        services: 15
      };
    }, 500);
  }
}