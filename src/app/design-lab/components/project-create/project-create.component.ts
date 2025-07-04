import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators,} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {ProjectService} from '../../services/project.service';
import {CreateProjectRequest} from '../../services/project.request';
import {GARMENT_COLOR, GARMENT_SIZE, PROJECT_GENDER} from '../../../const';

interface GarmentColorOption {
  label: string;
  value: GARMENT_COLOR;
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
    TranslateModule,
  ],
  templateUrl: './project-create.component.html',
  styleUrls: ['./project-create.component.css'],
  providers: [ProjectService],
})
export class ProjectCreateComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private projectService = inject(ProjectService);
  private snackBar = inject(MatSnackBar);
  private translate = inject(TranslateService);

  projectForm: FormGroup;
  isSubmitting = false;

  // Garment colors configuration using the GARMENT_COLOR enum
  garmentColors: GarmentColorOption[] = [
    { label: 'black', value: GARMENT_COLOR.BLACK },
    { label: 'gray', value: GARMENT_COLOR.GRAY },
    { label: 'light_gray', value: GARMENT_COLOR.LIGHT_GRAY },
    { label: 'white', value: GARMENT_COLOR.WHITE },
    { label: 'red', value: GARMENT_COLOR.RED },
    { label: 'pink', value: GARMENT_COLOR.PINK },
    { label: 'light_purple', value: GARMENT_COLOR.LIGHT_PURPLE },
    { label: 'purple', value: GARMENT_COLOR.PURPLE },
    { label: 'light_blue', value: GARMENT_COLOR.LIGHT_BLUE },
    { label: 'cyan', value: GARMENT_COLOR.CYAN },
    { label: 'sky_blue', value: GARMENT_COLOR.SKY_BLUE },
    { label: 'blue', value: GARMENT_COLOR.BLUE },
    { label: 'green', value: GARMENT_COLOR.GREEN },
    { label: 'light_green', value: GARMENT_COLOR.LIGHT_GREEN },
    { label: 'yellow', value: GARMENT_COLOR.YELLOW },
    { label: 'dark_yellow', value: GARMENT_COLOR.DARK_YELLOW },
  ];

  garmentColorImages =
    'https://res.cloudinary.com/dkkfv72vo/image/upload/v1747000549/Frame_530_hfhrko.webp';

  constructor() {
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      gender: [PROJECT_GENDER.MEN, Validators.required],
      garmentSize: [GARMENT_SIZE.M, Validators.required],
      garmentColor: [GARMENT_COLOR.WHITE, Validators.required],
    });
  }

  selectColor(colorValue: string): void {
    this.projectForm.get('garmentColor')?.setValue(colorValue as GARMENT_COLOR);
  }

  getGenderLabel(value: PROJECT_GENDER): string {
    const genderMap: { [key in PROJECT_GENDER]: string } = {
      [PROJECT_GENDER.WOMEN]: this.translate.instant('design.women'),
      [PROJECT_GENDER.MEN]: this.translate.instant('design.men'),
      [PROJECT_GENDER.KIDS]: this.translate.instant('design.kids'),
      [PROJECT_GENDER.UNISEX]: this.translate.instant('design.unisex'),
    };
    return genderMap[value] || value;
  }

  getColorLabel(value: GARMENT_COLOR): string {
    const foundColor = this.garmentColors.find(
      (color) => color.value === value
    );
    return foundColor ? this.translate.instant(`design.${foundColor.label}`) : this.translate.instant('design.custom');
  }

  getBackgroundPosition(colorValue: GARMENT_COLOR): string {
    const colorIndex = this.garmentColors.findIndex(
      (color) => color.value === colorValue
    );
    if (colorIndex === -1) return '0% 0%';
    const row = Math.floor(colorIndex / 4);
    const col = colorIndex % 4;
    const xPos = col * (100 / 3);
    const yPos = row * (100 / 3);
    return `${xPos}% ${yPos}%`;
  }

  onSubmit(): void {
    if (this.projectForm.invalid) return;

    this.isSubmitting = true;
    const formValue = this.projectForm.value;

    // Get userId from localStorage (IAM system)
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    console.log('🔍 Create Project - User ID:', userId);
    console.log('🔑 Create Project - Token present:', !!token);

    if (!userId) {
      this.snackBar.open(this.translate.instant('design.user_not_authenticated'), this.translate.instant('common.close'), { duration: 3000 });
      this.isSubmitting = false;
      return;
    }

    if (!token) {
      this.snackBar.open(this.translate.instant('design.authentication_token_missing'), this.translate.instant('common.close'), { duration: 3000 });
      this.isSubmitting = false;
      return;
    }

    const payload: CreateProjectRequest = {
      title: formValue.name,
      userId: userId,
      garmentColor: formValue.garmentColor,
      garmentGender: formValue.gender,
      garmentSize: formValue.garmentSize,
    };

    console.log('Creating project with payload:', payload);

    this.projectService.createProject(payload).subscribe({
      next: (project) => {
        console.log('Project created successfully:', project);
        this.snackBar.open(this.translate.instant('design.project_created_success'), this.translate.instant('common.close'), { duration: 2000 });
        this.router.navigate(['/design-lab', project.id, 'edit']);
      },
      error: (error) => {
        console.error('Failed to create project:', error);
        this.snackBar.open(this.translate.instant('design.failed_to_create_project'), this.translate.instant('common.close'), { duration: 2000 });
        this.isSubmitting = false;
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/design-lab']);
  }
}
