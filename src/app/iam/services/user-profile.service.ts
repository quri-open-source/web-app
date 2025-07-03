import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserProfile } from '../model/user-profile.entity';
import { UserProfileResponse } from '../model/user-profile.response';
import { UserProfileAssembler } from './user-profile.assembler';

/**
 * Service for managing user profiles within IAM context
 */
@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private basePath: string = `${environment.serverBaseUrl}`;

  constructor(private http: HttpClient) {}

  /**
   * Get user profile by user ID
   * @param userId The user ID
   * @returns Observable of UserProfile
   */
  getUserProfile(userId: string): Observable<UserProfile> {
    return this.http.get<UserProfileResponse>(`${this.basePath}/users/${userId}`)
      .pipe(
        map(response => UserProfileAssembler.toEntityFromResponse(response))
      );
  }

  /**
   * Get current user profile from localStorage userId
   * @returns Observable of UserProfile
   */
  getCurrentUserProfile(): Observable<UserProfile> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      throw new Error('No user ID found in session');
    }
    return this.getUserProfile(userId);
  }

  /**
   * Get current user ID from localStorage
   * @returns User ID or null if not found
   */
  getCurrentUserId(): string | null {
    return localStorage.getItem('userId');
  }

  /**
   * Get current username from localStorage
   * @returns Username or null if not found
   */
  getCurrentUsername(): string | null {
    return localStorage.getItem('username');
  }

  /**
   * Check if user is currently authenticated
   * @returns True if authenticated
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    return !!(token && userId);
  }
}
