import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCommonModule } from '@angular/material/core';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../model/project.entity';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterLink,
    MatCommonModule,
    // Add for edit form support
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
  ],
  template: `
    <div class="project-detail-container">
      <div class="header">
        <button mat-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
          Back to Projects
        </button>
        <h1 *ngIf="project">{{ project.name }}</h1>
      </div>

      <div *ngIf="loading" class="loading-container">
        <mat-spinner diameter="40"></mat-spinner>
        <p>Loading project...</p>
      </div>

      <div *ngIf="error" class="error-container">
        <p>{{ error }}</p>
        <button mat-button color="primary" (click)="loadProject()">
          Retry
        </button>
      </div>

      <div *ngIf="!loading && !error && project" class="project-content">
        <mat-card class="info-card">
          <mat-card-header>
            <mat-card-title>Project Information</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="project-info">
              <div
                class="project-image"
                [style.background-color]="(editMode ? editableProject?.garmentColor : project.garmentColor) || '#fff'"
              >
                <img
                  *ngIf="(editMode ? editableProject?.previewImageUrl : project.previewImageUrl)"
                  [src]="editMode ? editableProject?.previewImageUrl : project.previewImageUrl"
                  [alt]="editMode ? editableProject?.name : project.name"
                />
                <div *ngIf="!(editMode ? editableProject?.previewImageUrl : project.previewImageUrl)" class="no-preview">
                  <mat-icon>image</mat-icon>
                  <span>No preview</span>
                </div>
              </div>
              <div class="project-details">
                <ng-container *ngIf="!editMode; else editForm">
                  <h2>{{ project.name }}</h2>
                  <div class="detail-row">
                    <strong>Genre:</strong>
                    <span>{{ project.genre | titlecase }}</span>
                  </div>
                  <div class="detail-row">
                    <strong>Size:</strong> <span>{{ project.garmentSize }}</span>
                  </div>
                  <div class="detail-row">
                    <strong>Color:</strong>
                    <span class="color-preview" [style.background-color]="project.garmentColor"></span>
                    <span>{{ project.garmentColor }}</span>
                  </div>
                  <div class="detail-row">
                    <strong>Status:</strong>
                    <span>{{ project.status | titlecase }}</span>
                  </div>
                  <div class="detail-row">
                    <strong>Created:</strong>
                    <span>{{ project.createdAt | date : 'medium' }}</span>
                  </div>
                  <div class="detail-row">
                    <strong>Last modified:</strong>
                    <span>{{ project.lastModified | date : 'medium' }}</span>
                  </div>
                  <div class="actions">
                    <button mat-raised-button color="primary" (click)="enterEditMode()">
                      <mat-icon>edit</mat-icon> Edit Data
                    </button>
                    <button mat-raised-button color="accent" [routerLink]="['/design-lab', project.id, 'edit']">
                      <mat-icon>edit</mat-icon> Edit Design
                    </button>
                  </div>
                </ng-container>
                <ng-template #editForm>
                  <form (ngSubmit)="saveEdit()" autocomplete="off">
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Project Name</mat-label>
                      <input matInput [(ngModel)]="editableProject!.name" name="name" required />
                    </mat-form-field>
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Genre</mat-label>
                      <mat-select [(ngModel)]="editableProject!.genre" name="genre" required>
                        <mat-option *ngFor="let g of genreOptions" [value]="g">{{ g | titlecase }}</mat-option>
                      </mat-select>
                    </mat-form-field>
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Size</mat-label>
                      <mat-select [(ngModel)]="editableProject!.garmentSize" name="garmentSize" required>
                        <mat-option *ngFor="let s of sizeOptions" [value]="s">{{ s }}</mat-option>
                      </mat-select>
                    </mat-form-field>
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Color</mat-label>
                      <mat-select [(ngModel)]="editableProject!.garmentColor" name="garmentColor" required>
                        <mat-option *ngFor="let c of garmentColors" [value]="c.value">
                          <span class="color-preview" [style.background-color]="c.value"></span>
                          {{ c.label }} ({{ c.value }})
                        </mat-option>
                      </mat-select>
                      <mat-error *ngIf="colorError">{{ colorError }}</mat-error>
                    </mat-form-field>
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Status</mat-label>
                      <mat-select [(ngModel)]="editableProject!.status" name="status" required>
                        <mat-option *ngFor="let st of statusOptions" [value]="st">{{ st | titlecase }}</mat-option>
                      </mat-select>
                    </mat-form-field>
                    <div class="actions">
                      <button mat-raised-button color="primary" type="submit">Save</button>
                      <button mat-button type="button" (click)="cancelEdit()">Cancel</button>
                    </div>
                    <mat-error *ngIf="error">{{ error }}</mat-error>
                  </form>
                </ng-template>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="canvas-card">
          <mat-card-header>
            <mat-card-title>Canvas</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <!-- Canvas preview or editor would go here -->
            <div
              class="canvas-placeholder"
              [style.background-color]="
                project.canvas.backgroundColor || '#ffffff'
              "
            >
              <mat-icon>brush</mat-icon>
              <p>Canvas Preview</p>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [
    `
      .project-detail-container {
        padding: 24px;
        max-width: 1200px;
        margin: 0 auto;
      }

      .header {
        display: flex;
        align-items: center;
        margin-bottom: 24px;
      }

      .header h1 {
        margin: 0 0 0 16px;
        font-size: 2rem;
      }

      .loading-container,
      .error-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 48px;
        text-align: center;
        background-color: #f5f5f5;
        border-radius: 8px;
        margin: 24px 0;
      }

      .loading-container p,
      .error-container p {
        margin: 16px 0;
        color: #666;
      }

      .project-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 24px;
      }

      @media (max-width: 768px) {
        .project-content {
          grid-template-columns: 1fr;
        }
      }

      .info-card,
      .canvas-card {
        height: 100%;
      }

      .project-info {
        display: flex;
        flex-direction: column;
      }

      .project-image {
        height: 250px;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #f0f0f0;
        border-radius: 4px;
        margin-bottom: 16px;
      }

      .project-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .no-preview {
        display: flex;
        flex-direction: column;
        align-items: center;
        color: #999;
      }

      .no-preview mat-icon {
        font-size: 48px;
        height: 48px;
        width: 48px;
        margin-bottom: 8px;
      }

      .project-details h2 {
        margin-top: 0;
        margin-bottom: 16px;
      }

      .detail-row {
        display: flex;
        margin-bottom: 8px;
        align-items: center;
      }

      .detail-row strong {
        width: 120px;
        color: #666;
      }

      .color-preview {
        display: inline-block;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        margin-right: 8px;
        border: 1px solid #ddd;
      }

      .actions {
        margin-top: 24px;
      }

      .canvas-placeholder {
        height: 400px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: #f5f5f5;
        border-radius: 4px;
        color: #999;
      }

      .canvas-placeholder mat-icon {
        font-size: 64px;
        height: 64px;
        width: 64px;
        margin-bottom: 16px;
      }
    `,
  ],
  providers: [ProjectService],
})
export class ProjectDetailComponent implements OnInit {
  saveEdit(): void {
    if (!this.editableProject) return;

    // Validate required fields
    if (!this.editableProject!.name?.trim()) {
      this.error = 'Project name is required.';
      return;
    }
    if (!this.genreOptions.includes(this.editableProject!.genre)) {
      this.error = 'Invalid genre.';
      return;
    }
    if (!this.sizeOptions.includes(this.editableProject!.garmentSize)) {
      this.error = 'Invalid size.';
      return;
    }
    if (!this.statusOptions.includes(this.editableProject!.status)) {
      this.error = 'Invalid status.';
      return;
    }
    if (!this.validateColor(this.editableProject!.garmentColor)) {
      this.colorError = 'Color must be a valid hex code (e.g. #AABBCC)';
      return;
    }

    this.error = null;
    this.colorError = null;

    this.projectService.update(this.editableProject!.id, this.editableProject!).subscribe({
      next: () => {
        this.editMode = false;
        this.editableProject = null;
        this.loadProject();
      },
      error: (err) => {
        this.error = 'Failed to save changes. Please try again.';
      }
    });
  }
  enterEditMode(): void {
    if (this.project) {
      // Deep copy to avoid mutating the original until save
      this.editableProject = { ...this.project };
      // Si el size no es válido, asigna el predeterminado
      if (!this.sizeOptions.includes(this.editableProject.garmentSize)) {
        this.editableProject.garmentSize = 'M';
      }
      // Si el color no es válido, asigna el primero de la lista
      if (!this.garmentColors.some(c => c.value === this.editableProject!.garmentColor)) {
        this.editableProject!.garmentColor = this.garmentColors[0].value;
      }
      this.editMode = true;
      this.colorError = null;
    }
  }

  cancelEdit(): void {
    this.editMode = false;
    this.editableProject = null;
    this.colorError = null;
  }

  validateColor(color: string): boolean {
    // Accepts #RRGGBB hex
    return /^#[0-9A-Fa-f]{6}$/.test(color);
  }
  project: Project | null = null;
  loading = true;
  error: string | null = null;
  projectId: string = '';

  // Edit mode state
  editMode = false;
  editableProject: Project | null = null;
  // Select options
  readonly genreOptions = ['men', 'women', 'kid', 'other'];
  readonly sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  readonly statusOptions = ['blueprint', 'draft', 'final', 'archived'];
  readonly garmentColors = [
    { label: 'Black', value: '#161615' },
    { label: 'Gray', value: '#403D3B' },
    { label: 'White', value: '#EDEDED' },
    { label: 'Red', value: '#E94B3C' },
    { label: 'Pink', value: '#F2B5D4' },
    { label: 'Purple', value: '#A259C6' },
    { label: 'Blue', value: '#3B82F6' },
    { label: 'Light Blue', value: '#B3D6F6' },
    { label: 'Green', value: '#4CAF50' },
    { label: 'Yellow', value: '#FECD08' },
    { label: 'Dark Yellow', value: '#F2AB00' },
    { label: 'Orange', value: '#FF9800' },
    { label: 'Brown', value: '#795548' },
  ];
  colorError: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.projectId = params['id'];
      this.loadProject();
    });
  }

  loadProject(): void {
    if (!this.projectId) {
      this.error = 'No project ID provided';
      this.loading = false;
      return;
    }

    this.loading = true;
    this.error = null;

    this.projectService.getById(this.projectId).subscribe({
      next: (project) => {
        // Ensure date fields are always Date objects
        this.project = {
          ...project,
          createdAt: project.createdAt ? new Date(project.createdAt) : new Date(),
          lastModified: project.lastModified ? new Date(project.lastModified) : new Date(),
        };
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching project:', err);
        this.error =
          'Failed to load project. Please check if the project ID is valid.';
        this.loading = false;
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/design-lab']);
  }
}