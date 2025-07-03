import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { SignUpRequest } from '../../model/sign-up.request';
import { UserRoles, ROLE_OPTIONS, RoleOption } from '../../model/user-roles';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatSnackBarModule
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  signUpForm: FormGroup;
  isLoading = false;
  roleOptions: RoleOption[] = ROLE_OPTIONS;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.signUpForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      role: [UserRoles.ROLE_USER, [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else if (confirmPassword?.hasError('passwordMismatch')) {
      confirmPassword.setErrors(null);
    }
    
    return null;
  }

  onSubmit() {
    console.log('📋 Form submitted!');
    console.log('✅ Form valid:', this.signUpForm.valid);
    console.log('📝 Form values:', this.signUpForm.value);
    
    if (this.signUpForm.valid) {
      this.isLoading = true;
      const selectedRole = this.signUpForm.get('role')?.value;
      
      console.log('🎯 Selected role:', selectedRole);
      
      const signUpRequest = new SignUpRequest(
        this.signUpForm.get('username')?.value,
        this.signUpForm.get('password')?.value,
        [selectedRole] // Array with the selected role
      );

      console.log('🔧 SignUpRequest created:', signUpRequest);

      // Subscribe to the sign-up response to show success message
      this.authService.signUpWithCallback(signUpRequest).subscribe({
        next: (response: any) => {
          console.log('✅ Sign-up successful:', response);
          this.snackBar.open('Account created successfully! Please sign in.', 'Close', {
            duration: 5000,
            panelClass: ['success-snackbar']
          });
          this.isLoading = false;
          this.router.navigate(['/sign-in']);
        },
        error: (error: any) => {
          console.error('❌ Sign-up error:', error);
          this.snackBar.open('Error creating account. Please try again.', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          this.isLoading = false;
        }
      });
    } else {
      console.log('❌ Form is invalid');
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.signUpForm.controls).forEach(key => {
      const control = this.signUpForm.get(key);
      control?.markAsTouched();
    });
  }

  goToSignIn() {
    this.router.navigate(['/sign-in']);
  }

  getErrorMessage(fieldName: string): string {
    const control = this.signUpForm.get(fieldName);
    if (control?.hasError('required')) {
      return `${fieldName} is required`;
    }
    if (control?.hasError('minlength')) {
      return `${fieldName} must be at least ${control.errors?.['minlength']?.requiredLength} characters long`;
    }
    if (control?.hasError('passwordMismatch')) {
      return 'Passwords do not match';
    }
    return '';
  }
}
