import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-project-edit-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Edit Project</h2>
    <form (ngSubmit)="save()" #form="ngForm" style="min-width:300px;">
      <mat-form-field appearance="fill" style="width:100%;">
        <mat-label>Project Name</mat-label>
        <input matInput [(ngModel)]="data.name" name="name" required placeholder="Enter project name" />
        <mat-error *ngIf="form.submitted && !data.name">Name is required</mat-error>
      </mat-form-field>
      <mat-form-field appearance="fill" style="width:100%;">
        <mat-label>Genre</mat-label>
        <mat-select [(ngModel)]="data.genre" name="genre" required>
          <mat-option *ngFor="let g of genres" [value]="g.value">{{g.label}}</mat-option>
        </mat-select>
      </mat-form-field>
      <mat-form-field appearance="fill" style="width:100%;">
        <mat-label>Size</mat-label>
        <mat-select [(ngModel)]="data.garmentSize" name="garmentSize" required>
          <mat-option *ngFor="let s of sizes" [value]="s.value">{{s.label}}</mat-option>
        </mat-select>
      </mat-form-field>
      <mat-form-field appearance="fill" style="width:100%;">
        <mat-label>Color</mat-label>
        <mat-select [(ngModel)]="data.garmentColor" name="garmentColor" required>
          <mat-option *ngFor="let c of colors" [value]="c.value">
            <span class="color-dot" [style.background]="c.value"></span>
            {{c.label}}
          </mat-option>
        </mat-select>
      </mat-form-field>
      <mat-form-field appearance="fill" style="width:100%;">
        <mat-label>Status</mat-label>
        <mat-select [(ngModel)]="data.status" name="status" required>
          <mat-option *ngFor="let st of statuses" [value]="st.value">{{st.label}}</mat-option>
        </mat-select>
      </mat-form-field>
      <div style="margin-top:16px; text-align:right;">
        <button mat-button type="button" (click)="close()">Cancel</button>
        <button mat-flat-button color="primary" type="submit">Save</button>
      </div>
    </form>
  `,
  styles: [`
    .color-dot {
      display: inline-block;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      margin-right: 8px;
      vertical-align: middle;
      border: 1px solid #ccc;
    }
  `],
  providers: [ProjectService]
})
export class ProjectEditDialogComponent implements OnInit {
  genres: { label: string, value: string }[] = [];
  sizes: { label: string, value: string }[] = [];
  colors: { label: string, value: string }[] = [];
  statuses: { label: string, value: string }[] = [];

  constructor(
    public dialogRef: MatDialogRef<ProjectEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.projectService.getAllGenres().subscribe(genres => this.genres = genres);
    this.projectService.getAllGarmentSizes().subscribe(sizes => this.sizes = sizes);
    this.projectService.getAllGarmentColors().subscribe(colors => this.colors = colors);
    this.projectService.getAllProjectStatus().subscribe(statuses => this.statuses = statuses);
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    this.dialogRef.close(this.data);
  }
}
