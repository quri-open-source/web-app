import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { UserService } from '../../services/user.service';
import { User } from '../../model/user.entity';

@Component({
    selector: 'app-user-info',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        MatDividerModule,
        MatListModule,
        MatChipsModule,
        MatSelectModule,
    ],
    providers: [UserService],
    templateUrl: './user-info.component.html',
    styleUrl: './user-info.component.css',
})
export class UserInfoComponent implements OnInit {
    @Input() user!: User;
    editUser: any = {};
    private userService = inject(UserService);
    private snackBar = inject(MatSnackBar);

    ngOnInit() {
        console.log('UserInfoComponent initialized with user:', this.user);
        console.log("addresses", this.user?.profile?.addresses || []);
        this.editUser = { ...this.user };
        if (this.user?.profile) {
            this.editUser.profile = { ...this.user.profile };
        }
    }

    onUpdate() {
        // this.userService.updateUser(this.editUser).subscribe({
        //     next: (updated) => {
        //         this.user = { ...updated };
        //         this.snackBar.open('Update successful!', 'Close', {
        //             duration: 3000,
        //         });
        //     },
        //     error: () => {
        //         this.snackBar.open(
        //             'Error updating user. Please try again.',
        //             'Close',
        //             { duration: 4000 }
        //         );
        //     },
        // });
    }

}
