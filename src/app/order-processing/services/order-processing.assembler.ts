// order-processing.assembler.ts
// Utilidades para mapear entre entidades de dominio y DTOs de respuesta/solicitud

import { OrderEntity, ItemEntity } from '../model/order.entity';
import {
  OrderResponse,
  ItemResponse,
  CreateOrderRequest,
  OrderByIdResponse
} from './order-processing.response';

export class OrderProcessingAssembler {
  // De OrderResponse a OrderEntity
  static toEntity(response: OrderResponse): OrderEntity {
    return OrderEntity.fromResponse(response);
  }

  // De OrderEntity a OrderResponse
  static toResponse(entity: OrderEntity): OrderResponse {
    return {
      id: entity.id,
      userId: entity.userId,
      orderStatus: entity.orderStatus,
      items: entity.items.map(OrderProcessingAssembler.itemToResponse)
    };
  }

  // De ItemResponse a ItemEntity
  static itemToEntity(response: ItemResponse): ItemEntity {
    return ItemEntity.fromResponse(response);
  }

  // De ItemEntity a ItemResponse
  static itemToResponse(entity: ItemEntity): ItemResponse {
    return {
      id: entity.id,
      productId: entity.productId,
      quantity: entity.quantity
    };
  }

  // De OrderEntity a CreateOrderRequest
  static toCreateOrderRequest(entity: OrderEntity): CreateOrderRequest {
    return {
      userId: entity.userId,
      items: entity.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity
      }))
    };
  }

  // De OrderByIdResponse a OrderEntity
  static fromOrderByIdResponse(response: OrderByIdResponse): OrderEntity {
    return new OrderEntity(
      response.id,
      response.userId,
      response.orderStatus,
      response.items.map(ItemEntity.fromResponse)
    );
  }
}
