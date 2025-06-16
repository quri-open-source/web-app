import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserService } from '../../../user-management/services/user.service';

@Component({
  selector: 'app-role-switcher',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatSnackBarModule],
  template: `
    <mat-card class="role-switcher-card">
      <mat-card-header>
        <mat-card-title>Change Role (For testing only)</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <p>Current user: <strong>{{ getCurrentUserId() }}</strong></p>
        <p>Current role: <strong>{{ getCurrentRoleName() }}</strong></p>
        <p class="info-text" *ngIf="userService.getUserRole() === 'manufacturer'">
          You have access to: <strong>Order Management</strong>, <strong>Design Lab</strong>, <strong>Analytics</strong>, and all other features
        </p>
        <p class="info-text" *ngIf="userService.getUserRole() === 'customer'">
          You have access to: <strong>Design Lab</strong>, <strong>Analytics</strong>, etc.
        </p>
      </mat-card-content>
      <mat-card-actions>
        <button mat-raised-button 
                color="primary" 
                [disabled]="userService.getUserRole() === 'customer'"
                (click)="switchToCustomer()">
          Customer (Alice)
        </button>
        <button mat-raised-button 
                color="accent" 
                [disabled]="userService.getUserRole() === 'manufacturer'"
                (click)="switchToManufacturer()">
          Manufacturer (Bob)
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: `
    .role-switcher-card {
      max-width: 500px;
      margin: 20px auto;
      border: 2px solid #e0e0e0;
    }
    
    mat-card-header {
      background-color: #f5f5f5;
      padding: 16px;
      margin-bottom: 8px;
    }
    
    mat-card-content {
      padding: 16px;
    }
    
    mat-card-actions {
      display: flex;
      gap: 16px;
      padding: 16px;
      border-top: 1px solid #e0e0e0;
    }
    
    .info-text {
      padding: 8px;
      background-color: #f0f7ff;
      border-radius: 4px;
      font-size: 14px;
    }
  `
})
export class RoleSwitcherComponent {
  public userService = inject(UserService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  
  getCurrentRoleName(): string {
    const role = this.userService.getUserRole();
    return role === 'manufacturer' ? 'Manufacturer' : 'Customer';
  }
  
  getCurrentUserId(): string {
    const userId = this.userService.getSessionUserId();
    if (userId === 'user-1') {
      return 'user-1 (Alice)';
    } else if (userId === 'user-2') {
      return 'user-2 (Bob)';
    }
    return userId;
  }
  
  switchToCustomer(): void {
    console.log('Switching to customer role...');
    // Use direct login instead of API call for more reliable switching
    this.userService.loginAsDirect('user-1', 'customer');
    
    // Show a snackbar to indicate the role change
    this.snackBar.open('Switched to Customer role (Alice)', 'OK', {
      duration: 3000,
    });
    
    this.redirectBasedOnRole('customer');
  }
  
  switchToManufacturer(): void {
    console.log('Switching to manufacturer role...');
    // Use direct login instead of API call for more reliable switching
    this.userService.loginAsDirect('user-2', 'manufacturer');
    
    // Show a snackbar to indicate the role change
    this.snackBar.open('Switched to Manufacturer role (Bob)', 'OK', {
      duration: 3000,
    });
    
    this.redirectBasedOnRole('manufacturer');
  }
  
  private redirectBasedOnRole(role: string): void {
    // Use the role parameter instead of calling getUserRole() again
    if (role === 'manufacturer') {
      console.log('Redirecting to manufacturer dashboard');
      this.router.navigate(['/manufacturer-dashboard']);
    } else {
      console.log('Redirecting to home');
      this.router.navigate(['/home']);
    }
  }
}
