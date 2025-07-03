import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserProfile } from '../../model/user-profile.entity';
import { UserProfileService } from '../../services/user-profile.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {
  userProfile: UserProfile | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(
    private userProfileService: UserProfileService,
    private authService: AuthenticationService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  /**
   * Load the current user's profile
   */
  loadUserProfile(): void {
    this.isLoading = true;
    this.error = null;

    if (!this.userProfileService.isAuthenticated()) {
      this.router.navigate(['/sign-in']);
      return;
    }

    this.userProfileService.getCurrentUserProfile().subscribe({
      next: (profile) => {
        this.userProfile = profile;
        this.isLoading = false;
        console.log('User profile loaded:', profile);
      },
      error: (error) => {
        console.error('Error loading user profile:', error);
        this.error = 'Failed to load user profile';
        this.isLoading = false;
        this.snackBar.open('Error loading profile. Please try again.', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  /**
   * Sign out the user
   */
  onSignOut(): void {
    this.authService.signOut();
  }

  /**
   * Retry loading the profile
   */
  onRetry(): void {
    this.loadUserProfile();
  }

  /**
   * Get icon for role type
   */
  getRoleIcon(role: string): string {
    const roleIcons: { [key: string]: string } = {
      'ROLE_USER': 'person',
      'ROLE_ADMIN': 'admin_panel_settings',
      'ROLE_MANUFACTURER': 'factory',
      'ROLE_DESIGNER': 'design_services'
    };
    return roleIcons[role] || 'person';
  }

  /**
   * Get color for role chip
   */
  getRoleColor(role: string): string {
    const roleColors: { [key: string]: string } = {
      'ROLE_USER': 'primary',
      'ROLE_ADMIN': 'warn',
      'ROLE_MANUFACTURER': 'accent',
      'ROLE_DESIGNER': 'primary'
    };
    return roleColors[role] || 'primary';
  }

  /**
   * Format role name for display
   */
  formatRoleName(role: string): string {
    const roleNames: { [key: string]: string } = {
      'ROLE_USER': 'Customer',
      'ROLE_ADMIN': 'Administrator',
      'ROLE_MANUFACTURER': 'Manufacturer',
      'ROLE_DESIGNER': 'Designer'
    };
    return roleNames[role] || role;
  }
}
