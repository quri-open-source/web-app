import { OrderFulfillmentStatus } from '../services/order-fulfillments.response';

export class OrderFulfillment {
  constructor(
    public readonly id: string,
    public readonly orderId: string,
    public status: OrderFulfillmentStatus,
    public receivedDate: Date,
    public shippedDate: Date,
    public readonly manufacturerId: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {
    console.log("CREANDO ORDEN DE CUMPLIMIENTO", this);
  }

  markShipped(date: Date) {
    this.status = OrderFulfillmentStatus.SHIPPED;
    this.shippedDate = date;
  }

  markDelivered(date: Date) {
    this.status = OrderFulfillmentStatus.DELIVERED;
    this.receivedDate = date;
  }
}
