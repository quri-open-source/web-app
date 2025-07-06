import { OrderFulfillmentResponse } from './order-fulfillments.response';
import { OrderFulfillment } from '../model/order-fulfillment.entity';

export class OrderFulfillmentAssembler {
  static fromResponse(response: OrderFulfillmentResponse): OrderFulfillment {
    return new OrderFulfillment(
      response.id,
      response.orderId,
      response.fulfillmentStatus,
      new Date(response.receivedDate),
      new Date(response.shippedDate),
      response.manufacturerId,
      new Date(response.createdAt),
      new Date(response.updatedAt)
    );
  }

  static toResponse(entity: OrderFulfillment): OrderFulfillmentResponse {
    return {
      id: entity.id,
      orderId: entity.orderId,
      fulfillmentStatus: entity.fulfillmentStatus,
      receivedDate: entity.receivedDate,
      shippedDate: entity.shippedDate,
      manufacturerId: entity.manufacturerId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    };
  }
}
