import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../../user-management/services/user.service';
import { User } from '../../../user-management/model/user.entity';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { UserInfoComponent } from '../../../user-management/components/user-info/user-info.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-profile',
    imports: [
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        UserInfoComponent,
        CommonModule,
    ],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
    private userService = inject(UserService);
    user!: User;

    ngOnInit(): void {
        console.log('ProfileComponent: Starting to load user data...');
        this.userService.getCurrentUser().subscribe({
            next: (user) => {
                console.log('ProfileComponent: User data loaded successfully:', user);
                this.user = user;
            },
            error: (error) => {
                console.error('ProfileComponent: Error loading user data:', error);
            }
        });
    }
}
