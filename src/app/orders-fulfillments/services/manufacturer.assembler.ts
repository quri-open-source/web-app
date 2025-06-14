import { Manufacturer } from '../model/manufacturer.entity';

export class ManufacturerAssembler {
  public static toResourceFromEntity(entity: Manufacturer): any {
    return {
      id: entity.id,
      user_id: entity.user_id,
      name: entity.name,
      address: entity.address,
      city: entity.city,
      country: entity.country,
      state: entity.state,
      zip: entity.zip
    };
  }

  public static toEntityFromResource(resource: any): Manufacturer {
    return new Manufacturer({
      id: resource.id,
      user_id: resource.user_id,
      name: resource.name,
      address: resource.address,
      city: resource.city,
      country: resource.country,
      state: resource.state,
      zip: resource.zip
    });
  }
}
