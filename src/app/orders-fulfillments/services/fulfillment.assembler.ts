import { Fulfillment } from '../model/fulfillment.entity';

export class FulfillmentAssembler {
  public static toResourceFromEntity(entity: Fulfillment): any {
    return {
      id: entity.id,
      order_id: entity.orderId,
      status: entity.status,
      received_date: entity.receivedDate,
      shipped_date: entity.shippedDate,
      manufacturer_id: entity.manufacturerId,
      created_at: entity.createdAt,
      updated_at: entity.updatedAt
    };
  }

  public static toEntityFromResource(resource: any): Fulfillment {
    return new Fulfillment({
      id: resource.id,
      orderId: resource.order_id,
      status: resource.status,
      receivedDate: resource.received_date,
      shippedDate: resource.shipped_date,
      manufacturerId: resource.manufacturer_id,
      createdAt: resource.created_at,
      updatedAt: resource.updated_at
    });
  }
}
