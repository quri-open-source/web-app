// order-processing.service.ts
// Service to consume order processing API endpoints

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  UserOrdersResponse,
  OrderResponse,
  CreateOrderRequest,
  CreateOrderPaymentIntentRequest,
  CreateOrderPaymentIntentResponse,
  OrderByIdResponse
} from './order-processing.response';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OrderProcessingService {
  private readonly apiUrl = environment.serverBaseUrl + '/api/v1/orders';

  constructor(private http: HttpClient) {}

  // GET /api/v1/orders?userId=...
  getUserOrders(userId: string): Observable<UserOrdersResponse> {
    return this.http.get<UserOrdersResponse>(`${this.apiUrl}?userId=${userId}`);git
  }

  // POST /api/v1/orders
  createOrder(request: CreateOrderRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(this.apiUrl, request);
  }

  // POST /api/v1/orders/payment-intents
  createPaymentIntent(request: CreateOrderPaymentIntentRequest): Observable<CreateOrderPaymentIntentResponse> {
    return this.http.post<CreateOrderPaymentIntentResponse>(`${this.apiUrl}/payment-intents`, request);
  }

  // GET /api/v1/orders/{orderId}
  getOrderById(orderId: string): Observable<OrderByIdResponse> {
    return this.http.get<OrderByIdResponse>(`${this.apiUrl}/${orderId}`);
  }
}
