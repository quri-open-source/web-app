import { FulfillmentItemResponse } from './order-fulfillment-items.response';
import { FulfillmentItem } from '../model/fulfillment-item.entity';

export class FulfillmentItemAssembler {
  static fromResponse(response: FulfillmentItemResponse): FulfillmentItem {
    return new FulfillmentItem(
      response.id,
      response.fulfillmentId,
      response.productId,
      response.quantity,
      response.status
    );
  }

  static toResponse(entity: FulfillmentItem): FulfillmentItemResponse {
    return {
      id: entity.id,
      fulfillmentId: entity.fulfillmentId,
      productId: entity.productId,
      quantity: entity.quantity,
      status: entity.status
    };
  }
}
