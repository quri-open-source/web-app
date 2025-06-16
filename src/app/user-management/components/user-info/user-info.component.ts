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
import { of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { UserAssembler } from '../../services/user.assembler';

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

    // Address loading and error state
    addressesLoaded = false;
    errorLoadingAddresses = false;

    ngOnInit() {
        console.log('UserInfoComponent initialized with user:', this.user);
        console.log("addresses", this.user?.profile?.addresses || []);
        this.editUser = { ...this.user };
        if (this.user?.profile) {
            this.editUser.profile = { ...this.user.profile };
        }
        this.loadAddresses();
    }

    loadAddresses() {
        // Simulación: Cambia a throwError para probar el error de API
        // of(this.user.profile).pipe(delay(1000)).subscribe({
        //     next: (profile) => {
        //         this.user.profile = profile;
        //         this.addressesLoaded = true;
        //         this.errorLoadingAddresses = false;
        //     },
        //     error: () => {
        //         this.errorLoadingAddresses = true;
        //         this.addressesLoaded = true;
        //     }
        // });
        // Para probar el error de API, descomenta la siguiente línea y comenta la de arriba:
        // throwError(() => new Error('API error')).pipe(delay(1000)).subscribe({
        //     next: () => {},
        //     error: () => {
        //         this.errorLoadingAddresses = true;
        //         this.addressesLoaded = true;
        //     }
        // });
        // Por defecto, simula carga exitosa:
        this.addressesLoaded = true;
        this.errorLoadingAddresses = false;
    }

    onUpdate() {
        // Convert camelCase to snake_case for profile and addresses before PUT
        const userToUpdate = {
            ...this.editUser,
            profile: {
                ...this.editUser.profile,
                first_name: this.editUser.profile.firstName,
                last_name: this.editUser.profile.lastName,
                gender: this.editUser.profile.gender,
                addresses: (this.editUser.profile.addresses || []).map((a: any) => ({
                    ...a,
                    profile_id: a.profileId,
                    address: a.address,
                    city: a.city,
                    country: a.country,
                    state: a.state,
                    zip: a.zip
                }))
            }
        };
        delete userToUpdate.profile.firstName;
        delete userToUpdate.profile.lastName;
        userToUpdate.profile.addresses.forEach((a: any) => delete a.profileId);

        // Actualiza el perfil en la colección 'profiles' usando el id correcto
        const profileId = userToUpdate.profile.addresses[0]?.profile_id || null;
        if (profileId) {
            this.userService.updateProfile(profileId, {
                id: profileId,
                user_id: userToUpdate.id,
                first_name: userToUpdate.profile.first_name,
                last_name: userToUpdate.profile.last_name,
                gender: userToUpdate.profile.gender,
                addresses: userToUpdate.profile.addresses
            }).subscribe({
                next: () => {
                    // Después de actualizar el perfil, actualiza userWithProfile si existe
                    this.userService.updateUserWithProfile(userToUpdate.id, {
                        ...userToUpdate,
                        profile: {
                            first_name: userToUpdate.profile.first_name,
                            last_name: userToUpdate.profile.last_name,
                            gender: userToUpdate.profile.gender,
                            addresses: userToUpdate.profile.addresses
                        }
                    }).subscribe();
                }
            });
        }

        this.userService.updateUser(userToUpdate).subscribe({
            next: (updated) => {
                this.user = UserAssembler.toEntityFromResponse(updated);
                this.snackBar.open('Update successful!', 'Close', {
                    duration: 3000,
                });
            },
            error: () => {
                this.snackBar.open(
                    'Error updating user. Please try again.',
                    'Close',
                    { duration: 4000 }
                );
            },
        });
    }

}
