import { UserProfileResponse } from './user-profile.response';
import { UserEntity } from '../model/user.entity';
import { environment } from '../../../environments/environment.development';

export class UserProfileAssembler {
  /**
   * Returns the user profile assembled from the given user and projects.
   * Assumes the projects list is already filtered for the user.
   * If no user is provided, uses the defaultUserId from environment and expects it in the users list.
   * @param user The user entity or null (for fallback)
   * @param projects The list of projects already filtered for the user
   * @param users The list of all users
   * @returns UserProfileResponse or null if not found
   */
  getUserProfile(user: UserEntity | null, projects: any[], users: UserEntity[]): UserProfileResponse | null {
    let u = user;
    if (!u) {
      // Fallback: find user by defaultUserId from environment
      u = users.find(us => us.id === environment.defaultUserId) || null;
      if (!u) return null;
    }
    // Use only the name and email from the user entity (never hardcoded)
    const { id, name, email } = u;
    // Do NOT filter projects here; assume already filtered
    const userProjects = projects.map(p => ({ id: p.id, name: p.name }));
    return {
      id,
      name,
      email,
      projects: userProjects
    };
  }
}
