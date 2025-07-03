/**
 * Model for user profile response from backend
 */
export interface UserProfileResponse {
  id: string;
  username: string;
  roles: string[];
}

/**
 * Model for role information
 */
export interface RoleInfo {
  id: number;
  name: string;
}
