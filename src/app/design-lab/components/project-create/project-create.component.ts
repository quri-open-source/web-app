import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../model/project.entity';

interface GarmentColor {
  label: string;
  value: string;
}

@Component({
  selector: 'app-project-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatGridListModule,
    MatTooltipModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="create-project-container">
      <div class="page-header">
        <button mat-icon-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1>Create New Project</h1>
      </div>

      <div class="create-form-container">
        <form [formGroup]="projectForm" (ngSubmit)="onSubmit()">
          <mat-card>
            <mat-card-content>
              <div class="form-layout">
                <div class="form-fields">
                  <h2>Project Details</h2>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Project Name</mat-label>
                    <input
                      matInput
                      formControlName="name"
                      placeholder="Enter project name"
                    />
                    <mat-error
                      *ngIf="projectForm.get('name')?.hasError('required')"
                    >
                      Name is required
                    </mat-error>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Genre</mat-label>
                    <mat-select formControlName="genre">
                      <mat-option value="women">Women</mat-option>
                      <mat-option value="men">Men</mat-option>
                      <mat-option value="kid">Kid</mat-option>
                      <mat-option value="other">Other</mat-option>
                    </mat-select>
                    <mat-error
                      *ngIf="projectForm.get('genre')?.hasError('required')"
                    >
                      Genre is required
                    </mat-error>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Size</mat-label>
                    <mat-select formControlName="garmentSize">
                      <mat-option value="S">S</mat-option>
                      <mat-option value="M">M</mat-option>
                      <mat-option value="L">L</mat-option>
                      <mat-option value="XL">XL</mat-option>
                      <mat-option value="XXL">XXL</mat-option>
                    </mat-select>
                    <mat-error
                      *ngIf="
                        projectForm.get('garmentSize')?.hasError('required')
                      "
                    >
                      Size is required
                    </mat-error>
                  </mat-form-field>

                  <h3>T-Shirt Color</h3>
                  <div class="color-grid-container">
                    <mat-grid-list cols="4" rowHeight="50px">
                      @for (color of garmentColors; track color.value) {
                      <mat-grid-tile>
                        <div
                          class="color-swatch"
                          [style.background-color]="color.value"
                          [class.selected]="
                            projectForm.get('garmentColor')?.value ===
                            color.value
                          "
                          (click)="selectColor(color.value)"
                          [matTooltip]="color.label"
                        ></div>
                      </mat-grid-tile>
                      }
                    </mat-grid-list>
                  </div>
                </div>
                <div class="preview-container">
                  <h2>Preview</h2>
                  <div class="tshirt-preview">
                    <div class="tshirt-container">
                      <div class="tshirt-image">
                        <div
                          class="cropped-image"
                          [style.background-image]="
                            'url(' + garmentColorImages + ')'
                          "
                          [style.background-position]="
                            getBackgroundPosition(
                              projectForm.get('garmentColor')?.value
                            )
                          "
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div
                    class="preview-details"
                    *ngIf="projectForm.get('name')?.value"
                  >
                    <h3>{{ projectForm.get('name')?.value }}</h3>
                    <p *ngIf="projectForm.get('genre')?.value">
                      Genre:
                      {{ getGenreLabel(projectForm.get('genre')?.value) }}
                    </p>
                    <p *ngIf="projectForm.get('garmentSize')?.value">
                      Size: {{ projectForm.get('garmentSize')?.value }}
                    </p>
                    <p>
                      Color:
                      <span class="color-name">{{
                        getColorLabel(projectForm.get('garmentColor')?.value)
                      }}</span>
                      <span
                        class="color-preview"
                        [style.background-color]="
                          projectForm.get('garmentColor')?.value
                        "
                      ></span>
                    </p>
                  </div>
                </div>
              </div>
            </mat-card-content>

            <mat-card-actions align="end">
              <button mat-button type="button" (click)="goBack()">
                CANCEL
              </button>
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="projectForm.invalid || isSubmitting"
              >
                <mat-icon>save</mat-icon>
                CREATE PROJECT
              </button>
            </mat-card-actions>
          </mat-card>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      .create-project-container {
        padding: 24px;
        max-width: 1200px;
        margin: 0 auto;
      }

      .page-header {
        display: flex;
        align-items: center;
        margin-bottom: 24px;
      }

      .page-header h1 {
        margin: 0 0 0 16px;
        font-size: 2rem;
      }

      .create-form-container {
        margin-bottom: 24px;
      }

      .form-layout {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 32px;
      }

      @media (max-width: 768px) {
        .form-layout {
          grid-template-columns: 1fr;
        }
      }

      .form-fields {
        display: flex;
        flex-direction: column;
      }

      .full-width {
        width: 100%;
        margin-bottom: 16px;
      }

      h2 {
        margin-top: 0;
        margin-bottom: 24px;
        color: #333;
        font-size: 1.5rem;
      }

      h3 {
        margin-top: 8px;
        margin-bottom: 16px;
        color: #555;
        font-size: 1.2rem;
      }

      .color-grid-container {
        margin-bottom: 24px;
      }

      .color-swatch {
        width: 36px;
        height: 36px;
        border-radius: 4px;
        cursor: pointer;
        border: 2px solid transparent;
        transition: transform 0.2s, border-color 0.2s;
      }

      .color-swatch:hover {
        transform: scale(1.1);
      }

      .color-swatch.selected {
        border-color: #3f51b5;
        transform: scale(1.1);
      }
      .preview-container {
        background-color: #f5f5f5;
        border-radius: 8px;
        padding: 24px;
        display: flex;
        flex-direction: column;
      }

      .tshirt-preview {
        height: 330px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #ffffff;
        border-radius: 4px;
        overflow: hidden;
        padding: 16px;
        margin-bottom: 16px;
        box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.05);
      }
      .tshirt-container {
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        transition: background-color 0.3s ease;
      }
      .tshirt-image {
        width: 300px;
        height: 300px;
        border-radius: 8px;
        position: relative;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        /* No more clip-path as we're using background image cropping */
      }

      .cropped-image {
        width: 100%;
        height: 100%;
        background-size: 400% 400%; /* 4x4 grid */
        background-repeat: no-repeat;
        transition: background-position 0.3s ease;
        filter: drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.1));
      }

      .preview-details {
        padding: 16px;
        background-color: white;
        border-radius: 4px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }
      .preview-details h3 {
        margin-top: 0;
        margin-bottom: 8px;
      }

      .preview-details p {
        margin: 4px 0;
        color: #666;
        display: flex;
        align-items: center;
      }

      .color-preview {
        display: inline-block;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        margin-left: 8px;
        border: 1px solid #ddd;
      }

      .color-name {
        text-transform: capitalize;
        margin-left: 4px;
      }

      mat-card-actions {
        padding: 16px;
      }
    `,
  ],
  providers: [ProjectService],
})
export class ProjectCreateComponent {
  projectForm: FormGroup;
  isSubmitting = false;

  // Garment colors configuration
  garmentColors: GarmentColor[] = [
    { label: 'black', value: '#161615' }, // row 0, col 0
    { label: 'gray', value: '#403D3B' }, // row 0, col 1
    { label: 'light-gray', value: '#B3B1AF' }, // row 0, col 2
    { label: 'white', value: '#EDEDED' }, // row 0, col 3
    { label: 'red', value: '#B51B14' }, // row 1, col 0
    { label: 'pink', value: '#F459B0' }, // row 1, col 1
    { label: 'light-purple', value: '#D890E4' }, // row 1, col 2
    { label: 'purple', value: '#693FA0' }, // row 1, col 3
    { label: 'light-blue', value: '#00A5BC' }, // row 2, col 0
    { label: 'cyan', value: '#31B7C9' }, // row 2, col 1
    { label: 'sky-blue', value: '#3F9BDC' }, // row 2, col 2
    { label: 'blue', value: '#1B3D92' }, // row 2, col 3
    { label: 'green', value: '#1B8937' }, // row 3, col 0
    { label: 'light-green', value: '#5BBE65' }, // row 3, col 1
    { label: 'yellow', value: '#FECD08' }, // row 3, col 2
    { label: 'dark-yellow', value: '#F2AB00' }, // row 3, col 3
  ];

  garmentColorImages =
    'https://res.cloudinary.com/dkkfv72vo/image/upload/v1747000549/Frame_530_hfhrko.webp';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private projectService: ProjectService,
    private snackBar: MatSnackBar
  ) {
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      genre: ['men', Validators.required],
      garmentSize: ['M', Validators.required],
      garmentColor: ['#EDEDED', Validators.required],
    });
  }

  selectColor(colorValue: string): void {
    this.projectForm.get('garmentColor')?.setValue(colorValue);
  }
  getGenreLabel(value: string): string {
    const genreMap: { [key: string]: string } = {
      women: 'Women',
      men: 'Men',
      kid: 'Kid',
      other: 'Other',
    };
    return genreMap[value] || value;
  }
  getColorLabel(value: string): string {
    const foundColor = this.garmentColors.find(
      (color) => color.value === value
    );
    return foundColor ? foundColor.label : 'Custom';
  }
  getBackgroundPosition(colorValue: string): string {
    // Find the index of the color in the garmentColors array
    const colorIndex = this.garmentColors.findIndex(
      (color) => color.value === colorValue
    );

    if (colorIndex === -1) return '0% 0%'; // Default to first position if not found

    // Calculate row and column (0-3) based on the index
    const row = Math.floor(colorIndex / 4);
    const col = colorIndex % 4;

    // Each cell is 25% of the image width/height
    // Multiply by 100/3 to get percentage (33.33%)
    const xPos = col * (100 / 3);
    const yPos = row * (100 / 3);

    return `${xPos}% ${yPos}%`;
  }

  onSubmit(): void {
    if (this.projectForm.invalid) {
      return;
    }

    this.isSubmitting = true;

    const userId = 'user-001'; // In a real app, get this from auth service
    const formValue = this.projectForm.value;

    // Create a new project
    const newProject = new Project(
      userId,
      formValue.name,
      formValue.genre,
      formValue.garmentSize,
      formValue.garmentColor
    );

    this.projectService.create(newProject).subscribe({
      next: (createdProject) => {
        this.isSubmitting = false;
        this.snackBar.open('Project created successfully!', 'Close', {
          duration: 3000,
        });
        this.router.navigate(['/design-lab', createdProject.id]);
      },
      error: (err) => {
        console.error('Error creating project:', err);
        this.isSubmitting = false;
        this.snackBar.open(
          'Failed to create project. Please try again.',
          'Close',
          {
            duration: 5000,
          }
        );
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/design-lab']);
  }
}