// Entidades de dominio para Order Processing
// Reutiliza las interfaces de response como base


import { OrderResponse, ItemResponse, OrderResponseStatus } from '../services/order-processing.response';

export type OrderStatus = OrderResponseStatus;

export class OrderEntity {
  constructor(
    public id: string,
    public userId: string,
    public orderStatus: OrderResponseStatus,
    public items: ItemEntity[]
  ) {}

  static fromResponse(response: OrderResponse): OrderEntity {
    return new OrderEntity(
      response.id,
      response.userId,
      response.orderStatus,
      response.items.map(ItemEntity.fromResponse)
    );
  }
}

export class ItemEntity {
  constructor(
    public id: string,
    public productId: string,
    public quantity: number
  ) {}

  static fromResponse(response: ItemResponse): ItemEntity {
    return new ItemEntity(
      response.id,
      response.productId,
      response.quantity
    );
  }
}
