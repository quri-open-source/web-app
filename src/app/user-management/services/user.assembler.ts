import { User } from '../model/user.entity';
import { ProfileAssembler } from './profile.assembler';
import { UserResponse } from './user.response';

export class UserAssembler {
    static toEntityFromResponse(response: UserResponse): User {

        const profile = ProfileAssembler.toEntityFromResponse(response.profile);

        return new User(response.id, response.email, response.token, response.rol, profile)
    }
}
