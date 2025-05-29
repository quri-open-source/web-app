import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

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
          @for (g of genres; track g) {
            <mat-option [value]="g">{{g}}</mat-option>
          }
        </mat-select>
      </mat-form-field>
      <mat-form-field appearance="fill" style="width:100%;">
        <mat-label>Size</mat-label>
        <mat-select [(ngModel)]="data.garmentSize" name="garmentSize" required>
          @for (s of sizes; track s) {
            <mat-option [value]="s">{{s}}</mat-option>
          }
        </mat-select>
      </mat-form-field>
      <mat-form-field appearance="fill" style="width:100%;">
        <mat-label>Color</mat-label>
        <mat-select [(ngModel)]="data.garmentColor" name="garmentColor" required>
          @for (c of colors; track c) {
            <mat-option [value]="c">{{c}}</mat-option>
          }
        </mat-select>
      </mat-form-field>
      <mat-form-field appearance="fill" style="width:100%;">
        <mat-label>Status</mat-label>
        <mat-select [(ngModel)]="data.status" name="status" required>
          @for (st of statuses; track st) {
            <mat-option [value]="st">{{st}}</mat-option>
          }
        </mat-select>
      </mat-form-field>
      <div style="margin-top:16px; text-align:right;">
        <button mat-button type="button" (click)="close()">Cancel</button>
        <button mat-flat-button color="primary" type="submit">Save</button>
      </div>
    </form>
  `
})
export class ProjectEditDialogComponent {
  genres = ['Men', 'Women', 'Kid', 'Other'];
  sizes = ['XS', 'S', 'M', 'L', 'XL'];
  colors = ['#FFFFFF', '#000000', '#FF0000', '#00FF00', '#0000FF'];
  statuses = ['blueprint', 'in progress', 'completed'];

  constructor(
    public dialogRef: MatDialogRef<ProjectEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  close() {
    this.dialogRef.close();
  }

  save() {
    this.dialogRef.close(this.data);
  }
}
