import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Project } from '../../model/project.entity';
import { ProjectService } from '../../services/project.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjectDeleteComponent } from '../project-delete/project-delete.component';
import { MatDialog } from '@angular/material/dialog';
import { ProjectEditDialogComponent } from '../project-edit-data/project-edit-dialog.component';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    ProjectDeleteComponent,
  ],
  template: `
    <mat-card class="project-card" [routerLink]="['/design-lab', project.id]">
      <div
        class="project-preview"
        [style.background-color]="project.garmentColor || '#fff'"
      >
        <img
          *ngIf="project.previewImageUrl"
          [src]="project.previewImageUrl"
          [alt]="project.name"
        />
        <div *ngIf="!project.previewImageUrl" class="no-preview">
          <mat-icon>image</mat-icon>
          <span>No preview</span>
        </div>
      </div>
      <mat-card-content>
        <h3>{{ project.name }}</h3>
        <div class="project-details-list">
          <div class="detail-row">{{ project.genre | titlecase }}</div>
          <div class="detail-row">Size: {{ getSize(project) }}</div>
          <div class="detail-row">Last modified: {{ getLastModified(project) }}</div>
        </div>
      </mat-card-content>
      <mat-card-actions>
        <button mat-button color="primary" (click)="onEditClick($event)">
          <mat-icon>edit</mat-icon>
          Edit
        </button>
        <app-project-delete [project]="project" (deleted)="deleted.emit($event)"></app-project-delete>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [
    `
      .project-card {
        min-height: 420px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
        transition: transform 0.2s, box-shadow 0.2s;
        cursor: pointer;
        background: #fff;
        color: #222;
      }
      .project-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
      }
      .project-preview {
        height: 200px;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #232428;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
      }
      .project-preview img {
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
      .project-title-row {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 1.2rem;
        font-weight: 500;
        margin: 8px 0 0 0;
      }
      .project-icon {
        font-size: 28px;
        color: var(--mat-primary, #3f51b5);
      }
      .project-title {
        font-size: 1.2rem;
        font-weight: 500;
        color: var(--mat-card-foreground, #fff);
      }
      .project-details-list {
        display: flex;
        flex-direction: column;
        gap: 2px;
        font-size: 0.98rem;
        color: #444;
      }
      .detail-row {
        margin-bottom: 2px;
      }
      .project-details-row {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 12px 0 0 0;
        font-size: 0.95rem;
        color: #b0b0b0;
      }
      .project-detail-icon {
        font-size: 18px;
        vertical-align: middle;
        color: #b0b0b0;
      }
      .project-detail-label {
        margin-right: 12px;
      }
      mat-card-actions {
        display: flex;
        justify-content: space-between;
        padding: 8px;
        margin-top: auto;
      }
    `
  ],
})
export class ProjectCardComponent {
  @Input() project!: Project;
  @Output() deleted = new EventEmitter<string>();
  @Output() edited = new EventEmitter<Project>();

  constructor(
    private projectService: ProjectService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  isValidDate(date: any): boolean {
    return date instanceof Date && !isNaN(date.getTime());
  }

  getSize(project: any): string {
    // Busca garmentSize o tshirt_size, y valida que no sea vacío
    const size = project.garmentSize || project.tshirt_size;
    if (!size || (typeof size === 'string' && size.trim() === '')) {
      return 'N/A';
    }
    return size;
  }

  getLastModified(project: any): string {
    // Busca lastModified o last_modified, y createdAt o created_at
    const getDate = (val: any) => {
      if (!val) return null;
      if (val instanceof Date && !isNaN(val.getTime())) return val;
      const d = new Date(val);
      return isNaN(d.getTime()) ? null : d;
    };
    let date = getDate(project.lastModified || project.last_modified);
    if (!date) {
      date = getDate(project.createdAt || project.created_at);
    }
    if (date) {
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }
    return 'N/A';
  }

  onEditClick(event: MouseEvent) {
    event.stopPropagation();
    this.editProject();
  }

  editProject() {
    const dialogRef = this.dialog.open(ProjectEditDialogComponent, {
      data: { ...this.project },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Actualiza en el backend y emite el cambio
        this.projectService.update(result.id, result).subscribe({
          next: (updated) => {
            this.edited.emit(updated);
            this.snackBar.open('Project updated!', 'Close', { duration: 2000 });
          },
          error: () => {
            this.snackBar.open('Error updating project', 'Close', { duration: 2000 });
          }
        });
      }
    });
  }
}