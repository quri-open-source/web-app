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
  templateUrl: './role-switcher.component.html',
  styleUrls: ['./role-switcher.component.css']
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
