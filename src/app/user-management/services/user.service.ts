import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BaseService } from '../../shared/services/base.service';
import { UserResponse } from './user.response';
import { Observable, map, of, tap } from 'rxjs';
import { UserAssembler } from './user.assembler';

const USER_WITH_PROFILE = (id: string) =>
    `http://localhost:3000/userWithProfile?id=${id}`;

// Local storage keys
const STORAGE_USER_ID = 'quri_user_id';
const STORAGE_USER_ROLE = 'quri_user_role';

@Injectable({
    providedIn: 'root',
})
export class UserService extends BaseService<UserResponse> {
    // Get userId from localStorage or fall back to environment default
    private userId: string = localStorage.getItem(STORAGE_USER_ID) || environment.devUser;
    // Get userRole from localStorage or fall back to environment default
    private userRole: string = localStorage.getItem(STORAGE_USER_ROLE) || environment.devRole;
    
    constructor() {
        super('users');
        console.log('UserService initialized with:', { userId: this.userId, role: this.userRole });
    }

    // Define user properties and methods here
    getSessionUserId(): string {
        return this.userId;
    }

    getUserRole(): string {
        console.log('Getting user role:', this.userRole);
        return this.userRole;
    }
    
    setUserRole(role: string): void {
        console.log('Setting user role:', role);
        this.userRole = role;
        // Store in localStorage for persistence
        localStorage.setItem(STORAGE_USER_ROLE, role);
    }
    
    /**
     * Force setting user role without API call - useful for testing
     */
    forceSetRole(role: string): void {
        console.log('Force setting role to:', role);
        this.setUserRole(role);
    }

    getCurrentUser() {
        return this.http
            .get<UserResponse[]>(USER_WITH_PROFILE(this.userId))
            .pipe(map((response) => UserAssembler.toEntityFromResponse(response[0])));
    }
    
    getUserWithProfile(userId: string): Observable<any> {
        return this.http
            .get<any[]>(USER_WITH_PROFILE(userId))
            .pipe(map((response) => response[0]));
    }
    
    // Method to simulate login as different user types (for testing)
    // Returns an Observable so we can wait for the role to be loaded
    loginAs(userId: string): Observable<string> {
        console.log('Logging in as user:', userId);
        this.userId = userId;
        // Store in localStorage for persistence
        localStorage.setItem(STORAGE_USER_ID, userId);
        
        // Get user data synchronously first
        return this.http
            .get<any[]>(USER_WITH_PROFILE(userId))
            .pipe(
                map((response) => {
                    const user = response[0];
                    console.log('User data fetched:', user);
                    if (user && user.rol) {
                        console.log('Setting role from user data:', user.rol);
                        this.setUserRole(user.rol); // Use the method that saves to localStorage
                    } else {
                        console.warn('No role found in user data');
                    }
                    return this.userRole; // Return the role
                }),
                tap(role => console.log('Final role after login:', role))
            );
    }
    
    // Hard-coded login for testing - skips API call
    loginAsDirect(userId: string, role: string): void {
        console.log('Direct login as:', { userId, role });
        this.userId = userId;
        localStorage.setItem(STORAGE_USER_ID, userId);
        this.setUserRole(role);
    }
    
    // Check if the user is logged in
    isLoggedIn(): boolean {
        return !!this.userId;
    }
    
    // Logout method to clear the session
    logout(): void {
        console.log('Logging out');
        this.userId = environment.devUser;
        this.userRole = environment.devRole;
        localStorage.removeItem(STORAGE_USER_ID);
        localStorage.removeItem(STORAGE_USER_ROLE);
    }
}
