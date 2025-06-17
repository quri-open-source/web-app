import { Access } from '../model/access.entity';
import { AccessResponse } from './access.response';

export class AccessAssembler {
  static toEntity(response: AccessResponse): Access {
    return new Access(
      response.id,
      response.user_id,
      response.role,
      response.permissions
    );
  }

  static toResponse(entity: Access): AccessResponse {
    return {
      id: entity.id,
      user_id: entity.userId,
      role: entity.role,
      permissions: entity.permissions
    };
  }
}
