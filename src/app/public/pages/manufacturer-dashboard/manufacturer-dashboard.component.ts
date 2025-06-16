import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-manufacturer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="manufacturer-dashboard">
      <h1>Manufacturer Dashboard</h1>
      <p class="dashboard-intro">Welcome to your manufacturing portal. Manage orders, track production, and analyze performance.</p>
      
      <div class="dashboard-cards">
        <mat-card class="dashboard-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>list_alt</mat-icon>
            <mat-card-title>Order Management</mat-card-title>
            <mat-card-subtitle>View and manage customer orders</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>Access all your production orders, update their status, and manage fulfillment.</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary" [routerLink]="['/manufacturer-orders']">View Orders</button>
          </mat-card-actions>
        </mat-card>
        
        <mat-card class="dashboard-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>bar_chart</mat-icon>
            <mat-card-title>Analytics</mat-card-title>
            <mat-card-subtitle>Track manufacturing metrics</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>Monitor production efficiency, order volume, and customer satisfaction metrics.</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="accent" [routerLink]="['/dashboard']">View Analytics</button>
          </mat-card-actions>
        </mat-card>
        
        <mat-card class="dashboard-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>settings</mat-icon>
            <mat-card-title>Settings</mat-card-title>
            <mat-card-subtitle>Configure your manufacturing profile</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>Update your manufacturing capabilities, capacity, and business information.</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button [routerLink]="['/settings']">Manage Settings</button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: `
    .manufacturer-dashboard {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }
    
    h1 {
      font-size: 32px;
      margin-bottom: 16px;
    }
    
    .dashboard-intro {
      font-size: 16px;
      color: #666;
      margin-bottom: 32px;
      max-width: 800px;
    }
    
    .dashboard-cards {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 24px;
    }
    
    .dashboard-card {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    
    mat-card-content {
      flex-grow: 1;
    }
    
    mat-card-actions {
      padding: 16px;
      display: flex;
      justify-content: flex-end;
    }
    
    @media (max-width: 768px) {
      .dashboard-cards {
        grid-template-columns: 1fr;
      }
    }
  `
})
export class ManufacturerDashboardComponent {}
