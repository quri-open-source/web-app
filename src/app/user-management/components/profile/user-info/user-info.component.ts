import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { UserEntity } from '../../../model/user.entity';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule, ReactiveFormsModule, MatIconModule],
  providers: [UserService],
  template: `
    <mat-card class="user-info-card">
      <div class="user-info-row">
        <div class="avatar-container">
          <mat-icon class="avatar-icon" *ngIf="!editUser.avatar">person</mat-icon>
          <img *ngIf="editUser.avatar" [src]="editUser.avatar" class="avatar-img" alt="User avatar" />
        </div>
        <div class="user-fields-container">
          <mat-form-field appearance="fill" class="user-field">
            <mat-label>Username</mat-label>
            <input matInput [(ngModel)]="editUser.name" name="name" required style="color: #111; font-size: 1.2rem; font-weight: 500" />
          </mat-form-field>
          <mat-form-field appearance="fill" class="user-field">
            <mat-label>Email</mat-label>
            <input matInput [(ngModel)]="editUser.email" name="email" required style="color: #111; font-family: 'Fira Mono', 'Consolas', monospace; font-size: 1.1rem" />
          </mat-form-field>
        </div>
      </div>
      <button mat-flat-button color="primary" class="update-btn" type="submit" (click)="onUpdate()">
        UPDATE
      </button>
    </mat-card>
  `,
  styleUrl: './user-info.component.css',
})
export class UserInfoComponent {
  @Input() user: UserEntity | any;
  editUser: any = {};
  private userService = inject(UserService);
  private snackBar = inject(MatSnackBar);

  ngOnInit() {
    this.editUser = { ...this.user };
  }

  onUpdate() {
    this.userService.updateUser(this.editUser).subscribe({
      next: (updated) => {
        this.user = { ...updated };
        this.snackBar.open('Update successful!', 'Close', { duration: 3000 });
      },
      error: () => {
        this.snackBar.open('Error updating user. Please try again.', 'Close', { duration: 4000 });
      }
    });
  }
}
