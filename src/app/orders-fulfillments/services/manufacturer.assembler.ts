import { Manufacturer } from '../model/manufacturer.entity';

export class ManufacturerAssembler {
  public static toResourceFromEntity(entity: Manufacturer): any {
    return {
      id: entity.id,
      userId: entity.userId,
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
      userId: resource.userId,
      name: resource.name,
      address: resource.address,
      city: resource.city,
      country: resource.country,
      state: resource.state,
      zip: resource.zip
    });
  }
}
