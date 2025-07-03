import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { SignInRequest } from '../../model/sign-in.request';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css',
})
export class SignInComponent {
  signInForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.signInForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.signInForm.valid) {
      this.isLoading = true;
      const signInRequest = new SignInRequest(
        this.signInForm.get('username')?.value,
        this.signInForm.get('password')?.value
      );

      // Subscribe to handle success/error messages
      this.authService.signInWithCallback(signInRequest).subscribe({
        next: (response: any) => {
          // Update authentication state
          this.authService.updateAuthenticationState(response);

          this.snackBar.open(`Welcome back, ${response.username}!`, 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar'],
          });
          this.isLoading = false;
          this.router.navigate(['/']);
        },
        error: (error: any) => {
          this.snackBar.open(
            'Invalid username or password. Please try again.',
            'Close',
            {
              duration: 5000,
              panelClass: ['error-snackbar'],
            }
          );
          this.isLoading = false;
        },
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.signInForm.controls).forEach((key) => {
      const control = this.signInForm.get(key);
      control?.markAsTouched();
    });
  }

  goToSignUp() {
    this.router.navigate(['/sign-up']);
  }

  getErrorMessage(fieldName: string): string {
    const control = this.signInForm.get(fieldName);
    if (control?.hasError('required')) {
      return `${fieldName} is required`;
    }
    if (control?.hasError('minlength')) {
      return `${fieldName} must be at least ${control.errors?.['minlength']?.requiredLength} characters long`;
    }
    return '';
  }
}
