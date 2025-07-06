import { OrderFulfillmentItemStatus } from '../services/order-fulfillment-items.response';

export class FulfillmentItem {
  constructor(
    public readonly id: string,
    public readonly fulfillmentId: string,
    public readonly productId: string,
    public quantity: number,
    public status: OrderFulfillmentItemStatus
  ) {}

  markStatus(newStatus: OrderFulfillmentItemStatus) {
    this.status = newStatus;
  }
}
