import { Manufacturer } from '../model/manufacturer.entity';
import { ManufacturerResponse } from './manufacturer.response';

export class ManufacturerAssembler {
  static fromResponse(response: ManufacturerResponse): Manufacturer {
    return new Manufacturer(
      response.id,
      response.userId,
      response.name,
      response.address,
      response.city,
      response.country,
      response.state,
      response.zip,
      new Date(response.createdAt),
      new Date(response.updatedAt)
    );
  }

  static toResponse(entity: Manufacturer): ManufacturerResponse {
    return {
      id: entity.id,
      userId: entity.userId,
      name: entity.name,
      address: entity.address,
      city: entity.city,
      country: entity.country,
      state: entity.state,
      zip: entity.zip,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString()
    };
  }
}
