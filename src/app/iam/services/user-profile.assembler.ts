import { UserProfile } from '../model/user-profile.entity';
import { UserProfileResponse } from '../model/user-profile.response';

/**
 * Assembler for converting UserProfile response to entity
 */
export class UserProfileAssembler {

  /**
   * Convert UserProfileResponse to UserProfile entity
   */
  static toEntityFromResponse(response: UserProfileResponse): UserProfile {
    return new UserProfile(
      response.id,
      response.username,
      response.roles
    );
  }

  /**
   * Convert array of UserProfileResponse to array of UserProfile entities
   */
  static toEntitiesFromResponse(responses: UserProfileResponse[]): UserProfile[] {
    return responses.map(response => this.toEntityFromResponse(response));
  }
}
