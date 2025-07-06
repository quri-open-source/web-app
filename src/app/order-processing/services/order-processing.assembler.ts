// order-processing.assembler.ts
// Utilities for mapping between domain entities and request/response DTOs

import { OrderEntity, ItemEntity } from '../model/order.entity';
import {
  OrderResponse,
  ItemResponse,
  CreateOrderRequest,
  OrderByIdResponse
} from './order-processing.response';

export class OrderProcessingAssembler {
  // From OrderResponse to OrderEntity
  static toEntity(response: OrderResponse): OrderEntity {
    return OrderEntity.fromResponse(response);
  }

  // From OrderEntity to OrderResponse
  static toResponse(entity: OrderEntity): OrderResponse {
    return {
      id: entity.id,
      userId: entity.userId,
      orderStatus: entity.orderStatus,
      items: entity.items.map(OrderProcessingAssembler.itemToResponse)
    };
  }

  // From ItemResponse to ItemEntity
  static itemToEntity(response: ItemResponse): ItemEntity {
    return ItemEntity.fromResponse(response);
  }

  // From ItemEntity to ItemResponse
  static itemToResponse(entity: ItemEntity): ItemResponse {
    return {
      id: entity.id,
      productId: entity.productId,
      quantity: entity.quantity
    };
  }

  // From OrderEntity to CreateOrderRequest
  static toCreateOrderRequest(entity: OrderEntity): CreateOrderRequest {
    return {
      userId: entity.userId,
      items: entity.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity
      }))
    };
  }

  // From OrderByIdResponse to OrderEntity
  static fromOrderByIdResponse(response: OrderByIdResponse): OrderEntity {
    return new OrderEntity(
      response.id,
      response.userId,
      response.orderStatus,
      response.items.map(ItemEntity.fromResponse)
    );
  }
}
