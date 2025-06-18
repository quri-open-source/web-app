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
import { ManufacturerService, ManufacturerProfile } from '../../services/manufacturer.service';
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
    manufacturerProfile: ManufacturerProfile | null = null;
    manufacturerUser: any = null;
    isManufacturer = false;
    private manufacturerService = inject(ManufacturerService);
    private userService = inject(UserService);
    private snackBar = inject(MatSnackBar);

    // Address loading and error state
    addressesLoaded = false;
    errorLoadingAddresses = false;

    ngOnInit() {
        this.isManufacturer = this.user.rol === 'manufacturer';
        if (this.isManufacturer) {
            // Cargar manufacturer profile y user
            this.manufacturerService.getManufacturerByUserId(this.user.id).subscribe({
                next: (profiles) => {
                    this.manufacturerProfile = profiles[0];
                }
            });
            // Cargar userWithProfile para manufacturer
            this.userService.getUserWithProfile(this.user.id).subscribe({
                next: (user) => {
                    this.manufacturerUser = { ...user };
                }
            });
        } else {
            this.editUser = { ...this.user };
            if (this.user?.profile) {
                this.editUser.profile = { ...this.user.profile };
            }
            this.loadAddresses();
        }
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
        if (this.isManufacturer && this.manufacturerProfile && this.manufacturerUser) {
            // Actualiza manufacturer
            this.manufacturerService.updateManufacturer(this.manufacturerProfile.id, this.manufacturerProfile).subscribe({
                next: (updated) => {
                    this.manufacturerProfile = updated;
                    // Actualiza userWithProfile (nombre, email, género)
                    const userUpdate = {
                        ...this.manufacturerUser,
                        email: this.manufacturerUser.email,
                        profile: {
                            ...this.manufacturerUser.profile,
                            first_name: this.manufacturerUser.profile.first_name,
                            last_name: this.manufacturerUser.profile.last_name,
                            gender: this.manufacturerUser.profile.gender
                        }
                    };
                    this.userService.updateUserWithProfile(this.user.id, userUpdate).subscribe({
                        next: () => {
                            this.snackBar.open('Manufacturer profile updated!', 'Close', { duration: 3000 });
                        },
                        error: () => {
                            this.snackBar.open('Error updating manufacturer user. Please try again.', 'Close', { duration: 4000 });
                        }
                    });
                },
                error: () => {
                    this.snackBar.open('Error updating manufacturer. Please try again.', 'Close', { duration: 4000 });
                }
            });
            return;
        }
        // Customer flow (igual que antes)
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
                this.snackBar.open('Update successful!', 'Close', { duration: 3000 });
            },
            error: () => {
                this.snackBar.open('Error updating user. Please try again.', 'Close', { duration: 4000 });
            },
        });
    }

}
