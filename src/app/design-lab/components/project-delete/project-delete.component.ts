import { Component, Inject, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../model/project.entity';

@Component({
  selector: 'app-project-delete-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatDialogModule],
  template: `
    <h2 mat-dialog-title>Delete Project</h2>
    <div mat-dialog-content>Are you sure you want to delete this project?</div>
    <div mat-dialog-actions align="end">
      <button mat-button (click)="onCancel($event)">Cancel</button>
      <button mat-button color="warn" (click)="onDelete($event)">Delete</button>
    </div>
  `
})
export class ProjectDeleteDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ProjectDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { project: Project }
  ) {}

  onCancel(event: MouseEvent) {
    event.stopPropagation();
    this.dialogRef.close(false);
  }

  onDelete(event: MouseEvent) {
    event.stopPropagation();
    this.dialogRef.close(true);
  }
}

@Component({
  selector: 'app-project-delete',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatSnackBarModule, MatDialogModule],
  template: `
    <button mat-icon-button color="warn" (click)="openDialog($event)">
      <mat-icon>delete</mat-icon>
    </button>
  `
})
export class ProjectDeleteComponent {
  @Input() project!: Project;
  @Output() deleted = new EventEmitter<string>();

  constructor(
    private projectService: ProjectService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  openDialog(event: MouseEvent) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(ProjectDeleteDialogComponent, {
      data: { project: this.project },
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.projectService.delete(this.project.id).subscribe({
          next: () => {
            this.snackBar.open('Project deleted successfully!', 'Close', { duration: 3000 });
            this.deleted.emit(this.project.id);
          },
          error: () => {
            this.snackBar.open('Failed to delete project. Please try again.', 'Close', { duration: 5000 });
          }
        });
      }
    });
  }
}
