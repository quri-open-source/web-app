import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DesignLabService } from '../../services/design-lab-real.service';
import { CreateProjectRequest } from '../../services/project.response';
import { AuthenticationService } from '../../../iam/services/authentication.service';
import { GARMENT_COLOR, GARMENT_SIZE, PROJECT_GENDER } from '../../../const';

interface ColorOption {
  name: string;
  value: GARMENT_COLOR;
  hex: string;
}

@Component({
  selector: 'app-project-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule,
    MatToolbarModule,
    TranslateModule,
  ],
  templateUrl: './project-create.component.html',
  styleUrl: './project-create.component.css',
})
export class ProjectCreateComponent implements OnInit {
  projectForm: FormGroup;
  isCreating = false;

  // Enums for the template
  PROJECT_GENDER = PROJECT_GENDER;
  GARMENT_SIZE = GARMENT_SIZE;

  // Services
  private fb = inject(FormBuilder);
  private designLabService = inject(DesignLabService);
  private authService = inject(AuthenticationService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private translateService = inject(TranslateService);

  // Available color options
  availableColors: ColorOption[] = [
    { name: 'White', value: GARMENT_COLOR.WHITE, hex: '#FFFFFF' },
    { name: 'Black', value: GARMENT_COLOR.BLACK, hex: '#000000' },
    { name: 'Gray', value: GARMENT_COLOR.GRAY, hex: '#6B7280' },
    { name: 'Light Gray', value: GARMENT_COLOR.LIGHT_GRAY, hex: '#D1D5DB' },
    { name: 'Red', value: GARMENT_COLOR.RED, hex: '#DC2626' },
    { name: 'Pink', value: GARMENT_COLOR.PINK, hex: '#EC4899' },
    {
      name: 'Light Purple',
      value: GARMENT_COLOR.LIGHT_PURPLE,
      hex: '#A78BFA',
    },
    { name: 'Purple', value: GARMENT_COLOR.PURPLE, hex: '#7C3AED' },
    { name: 'Light Blue', value: GARMENT_COLOR.LIGHT_BLUE, hex: '#60A5FA' },
    { name: 'Cyan', value: GARMENT_COLOR.CYAN, hex: '#06B6D4' },
    { name: 'Sky Blue', value: GARMENT_COLOR.SKY_BLUE, hex: '#0EA5E9' },
    { name: 'Blue', value: GARMENT_COLOR.BLUE, hex: '#2563EB' },
    { name: 'Green', value: GARMENT_COLOR.GREEN, hex: '#059669' },
    { name: 'Light Green', value: GARMENT_COLOR.LIGHT_GREEN, hex: '#34D399' },
    { name: 'Yellow', value: GARMENT_COLOR.YELLOW, hex: '#FBBF24' },
    {
      name: 'Dark Yellow',
      value: GARMENT_COLOR.DARK_YELLOW,
      hex: '#D97706',
    },
  ];

  constructor() {
    this.projectForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      garmentColor: [GARMENT_COLOR.WHITE, Validators.required],
      garmentGender: [PROJECT_GENDER.UNISEX, Validators.required],
      garmentSize: [GARMENT_SIZE.M, Validators.required],
    });
  }

  ngOnInit(): void {
  }

  /**
   * Select the garment color.
   * @param color The selected garment color.
   */
  selectColor(color: GARMENT_COLOR): void {
    this.projectForm.patchValue({ garmentColor: color });
  }

  /**
   * Submit the form to create a new project.
   */
  onSubmit(): void {
    if (this.projectForm.valid) {
      this.createProject();
    } else {
      console.warn('⚠️ Form is invalid:', this.projectForm.errors);
      this.markFormGroupTouched();
    }
  }

  /**
   * Create the project using the form values and authenticated user ID.
   */
  private createProject(): void {
    this.isCreating = true;
    const formValue = this.projectForm.value;

    // Get the userId from the authentication service
    this.authService.currentUserId.subscribe({
      next: (userId) => {
        if (!userId) {
          this.showError(
            this.translateService.instant('designLab.errors.userNotAuthenticated')
          );
          this.isCreating = false;
          return;
        }

        const request: CreateProjectRequest = {
          title: formValue.title,
          garmentColor: formValue.garmentColor,
          garmentGender: formValue.garmentGender,
          garmentSize: formValue.garmentSize,
          userId: userId,
        };

        this.designLabService.createProject(request).subscribe({
          next: (result) => {

            this.snackBar.open(
              this.translateService.instant('designLab.messages.projectCreated'),
              this.translateService.instant('common.close'),
              {
                duration: 3000,
                panelClass: ['success-snackbar'],
              }
            );


            // Navigate to the project editor
            if (result.success && result.projectId) {
              this.router.navigate(['/home/design-lab/edit', result.projectId]);
            } else {
              this.showError(result.error || 'Error creating project');
            }
            this.isCreating = false;
          },
          error: (error: any) => {
            console.error('❌ Error creating project:', error);

            // Extract a more specific error message
            let errorMessage = this.translateService.instant(
              'designLab.errors.creationFailed'
            );

            if (error) {
              if (typeof error === 'string') {
                errorMessage = error;
              } else if (error.message) {
                errorMessage = error.message;
              } else if (error.error && error.error.message) {
                errorMessage = error.error.message;
              } else if (error.error && typeof error.error === 'string') {
                errorMessage = error.error;
              }
            }

            this.showError(errorMessage);
            this.isCreating = false;
          },
        });
      },
      error: (error) => {
        console.error('❌ Error getting user ID:', error);
        this.showError(
          this.translateService.instant('designLab.errors.userNotAuthenticated')
        );
        this.isCreating = false;
      }
    });
  }

  /**
   * Show an error message in a snackbar.
   * @param message The error message to display.
   */
  private showError(message: string): void {
    this.snackBar.open(message, this.translateService.instant('common.close'), {
      duration: 5000,
      panelClass: ['error-snackbar'],
    });
  }

  /**
   * Mark all form fields as touched to display validation errors.
   */
  private markFormGroupTouched(): void {
    Object.keys(this.projectForm.controls).forEach((key) => {
      const control = this.projectForm.get(key);
      control?.markAsTouched();
    });
  }
}
