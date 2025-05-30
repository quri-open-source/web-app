import { UserResponse } from './user-profile.response';
import { User } from '../model/user.entity';

export class UserAssembler {
   static toEntityFromResponse(response: UserResponse): User {
    return {
      id: response.id,
      email: response.email,
      name: response.name,
      created_at: response.created_at,
      password: response.password
    };
  }

  static toEntitiesFromResponse(response: UserResponse[]): User[] {
    return response.map(p => this.toEntityFromResponse(p));
  }
}
