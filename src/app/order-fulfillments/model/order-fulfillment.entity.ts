import { OrderFulfillmentStatus } from '../services/order-fulfillments.response';

export class OrderFulfillment {
  constructor(
    public readonly id: string,
    public readonly orderId: string,
    public fulfillmentStatus: OrderFulfillmentStatus,
    public receivedDate: Date,
    public shippedDate: Date,
    public readonly manufacturerId: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  markShipped(date: Date) {
    this.fulfillmentStatus = OrderFulfillmentStatus.SHIPPED;
    this.shippedDate = date;
  }

  markDelivered(date: Date) {
    this.fulfillmentStatus = OrderFulfillmentStatus.DELIVERED;
    this.receivedDate = date;
  }
}
