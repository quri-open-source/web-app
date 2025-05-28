import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatCommonModule } from '@angular/material/core';
import { Project } from '../../model/project.entity';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    MatCommonModule,
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
        <p class="project-details">
          <span class="detail">{{ project.genre | titlecase }}</span>
          <span class="detail">Size: {{ project.garmentSize }}</span>
          <span class="detail"
            >Last modified: {{ project.lastModified | date : 'short' }}</span
          >
        </p>
      </mat-card-content>
      <mat-card-actions>
        <button *ngIf="isEditable" mat-button color="primary" (click)="$event.stopPropagation()">
          <mat-icon>edit</mat-icon>
          Edit
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [
    `
      .project-card {
        height: 100%;
        display: flex;
        flex-direction: column;
        transition: transform 0.2s, box-shadow 0.2s;
        cursor: pointer;
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
        background-color: #f0f0f0;
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

      .project-card mat-card-content {
        flex-grow: 1;
      }

      .project-card h3 {
        margin: 8px 0;
        font-size: 1.2rem;
        font-weight: 500;
      }

      .project-details {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin: 0;
        font-size: 0.9rem;
        color: #666;
      }

      .detail {
        background-color: #f0f0f0;
        padding: 4px 8px;
        border-radius: 4px;
      }

      mat-card-actions {
        display: flex;
        justify-content: space-between;
        padding: 8px;
      }
    `,
  ],
})
export class ProjectCardComponent implements OnChanges {
  @Input() project!: Project;
  @Input() currentUserId?: string;

  get isEditable(): boolean {
    if (!this.currentUserId || !this.project) return false;
    // Accept both camelCase and snake_case for robustness
    return (
      this.project.userId === this.currentUserId ||
      (this.project as any).user_id === this.currentUserId
    );
  }

  ngOnChanges() {
    // Defensive: ensure date is always a Date object for the pipe
    if (this.project) {
      if (typeof this.project.lastModified === 'string') {
        this.project.lastModified = new Date(this.project.lastModified);
      }
      if (typeof this.project.createdAt === 'string') {
        this.project.createdAt = new Date(this.project.createdAt);
      }
    }
  }
}