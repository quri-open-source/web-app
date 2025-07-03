import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '../../../iam/services/authentication.service';

@Component({
    selector: 'app-profile',
    imports: [
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        CommonModule,
    ],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
    userEmail: string = '';
    userId: string = '';
    userRole: string = '';
    isSignedIn: boolean = false;

    constructor(private authService: AuthenticationService) {}

    ngOnInit(): void {
        console.log('ProfileComponent: Loading user profile from localStorage...');

        // Get user data from localStorage (IAM system)
        this.userId = localStorage.getItem('userId') || '';
        this.userEmail = localStorage.getItem('userEmail') || '';
        this.userRole = localStorage.getItem('userRole') || '';

        // Check if user is signed in
        this.authService.isSignedIn.subscribe(isSignedIn => {
            this.isSignedIn = isSignedIn;
            if (!isSignedIn) {
                console.log('ProfileComponent: User not signed in');
            } else {
                console.log('ProfileComponent: User profile loaded:', {
                    userId: this.userId,
                    email: this.userEmail,
                    role: this.userRole
                });
            }
        });
    }
}
