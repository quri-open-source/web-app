import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BaseService } from '../../access-security/services/access.service';
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
    constructor() {
        super('users');
    }

    // Define user properties and methods here
    getSessionUserId(): string {
        return localStorage.getItem(STORAGE_USER_ID) || environment.devUser;
    }

    getUserRole(): string {
        return localStorage.getItem(STORAGE_USER_ROLE) || environment.devRole;
    }

    setUserRole(role: string): void {
        localStorage.setItem(STORAGE_USER_ROLE, role);
    }

    setSessionUserId(userId: string): void {
        localStorage.setItem(STORAGE_USER_ID, userId);
    }

    getCurrentUser() {
        return this.http
            .get<UserResponse[]>(USER_WITH_PROFILE(this.getSessionUserId()))
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
        this.setSessionUserId(userId);
        return this.http
            .get<any[]>(USER_WITH_PROFILE(userId))
            .pipe(
                map((response) => {
                    const user = response[0];
                    if (user && user.rol) {
                        this.setUserRole(user.rol);
                    }
                    return this.getUserRole();
                }),
                tap(role => console.log('Final role after login:', role))
            );
    }
    
    // Hard-coded login for testing - skips API call
    loginAsDirect(userId: string, role: string): void {
        this.setSessionUserId(userId);
        this.setUserRole(role);
    }
    
    // Check if the user is logged in
    isLoggedIn(): boolean {
        return !!this.getSessionUserId();
    }
    
    // Logout method to clear the session
    logout(): void {
        localStorage.removeItem(STORAGE_USER_ID);
        localStorage.removeItem(STORAGE_USER_ROLE);
    }

    updateUser(user: any): Observable<any> {
        // PUT to /users/:id (RESTful, fácil de migrar a Java)
        return this.http.put<any>(`${this.resourcePath()}/${user.id}`, user);
    }

    updateProfile(profileId: string, profile: any): Observable<any> {
        // PUT to /profiles/:id
        return this.http.put<any>(`${environment.apiBaseUrl}/profiles/${profileId}`, profile);
    }

    updateUserWithProfile(userId: string, userWithProfile: any): Observable<any> {
        // PUT to /userWithProfile/:id
        return this.http.put<any>(`${environment.apiBaseUrl}/userWithProfile/${userId}`, userWithProfile);
    }
}
