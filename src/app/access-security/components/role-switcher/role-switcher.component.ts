import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserService } from '../../../user-management/services/user.service';
import { RoleDomainService } from '../../services/role-domain.service';
import { UserDomainService } from '../../services/user-domain.service';

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
  private roleDomainService = inject(RoleDomainService);
  private userDomainService = inject(UserDomainService);
  
  
  testUsers = [
      { id: 'user-1', name: 'Alice', role: 'customer' },
      { id: 'user-2', name: 'Bob', role: 'manufacturer' }
  ];

  switchUser(user: { id: string, name: string, role: string }) {
      this.userService.loginAsDirect(user.id, user.role);
      this.roleDomainService.setRole(user.role);
      this.userDomainService.setUser(user); 
      this.snackBar.open(`Switched to ${user.role} role (${user.name})`, 'OK', {
          duration: 3000,
      });
      this.redirectBasedOnRole(user.role);
  }

  getCurrentRoleName(): string {
    const role = this.userService.getUserRole();
    if (!role) return 'No role';
    return role.charAt(0).toUpperCase() + role.slice(1);
  }
  
  getCurrentUserId(): string {
    const userId = this.userService.getSessionUserId();
    const user = this.testUsers.find(u => u.id === userId);
    return user ? `${user.id} (${user.name})` : userId;
  }
  
  switchToCustomer(): void {
    console.log('Switching to customer role...');
    this.userService.loginAsDirect('user-1', 'customer');
    this.roleDomainService.setRole('customer');
    this.userDomainService.setUser({ id: 'user-1', name: 'Alice', role: 'customer' });
    this.snackBar.open('Switched to Customer role (Alice)', 'OK', {
      duration: 3000,
    });
    this.redirectBasedOnRole('customer');
  }
  
  switchToManufacturer(): void {
    console.log('Switching to manufacturer role...');
    this.userService.loginAsDirect('user-2', 'manufacturer');
    this.roleDomainService.setRole('manufacturer');
    this.userDomainService.setUser({ id: 'user-2', name: 'Bob', role: 'manufacturer' });
    this.snackBar.open('Switched to Manufacturer role (Bob)', 'OK', {
      duration: 3000,
    });
    this.redirectBasedOnRole('manufacturer');
  }
  
  private redirectBasedOnRole(role: string): void {
    if (role === 'manufacturer') {
      console.log('Redirecting to manufacturer dashboard');
      this.router.navigate(['/home']);
    } else {
      console.log('Redirecting to home');
      this.router.navigate(['/home']);
    }
  }
}
