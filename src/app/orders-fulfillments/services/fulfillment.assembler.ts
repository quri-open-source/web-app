import { Fulfillment } from '../model/fulfillment.entity';

export class FulfillmentAssembler {
  public static toResourceFromEntity(entity: Fulfillment): any {
    return {
      id: entity.id,
      order_id: entity.order_id,
      status: entity.status,
      received_date: entity.received_date,
      shipped_date: entity.shipped_date,
      manufacturer_id: entity.manufacturer_id
    };
  }

  public static toEntityFromResource(resource: any): Fulfillment {
    return new Fulfillment({
      id: resource.id,
      order_id: resource.order_id,
      status: resource.status,
      received_date: resource.received_date,
      shipped_date: resource.shipped_date,
      manufacturer_id: resource.manufacturer_id
    });
  }
}
