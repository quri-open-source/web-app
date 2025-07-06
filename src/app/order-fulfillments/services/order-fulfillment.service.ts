import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { OrderFulfillmentResponse, OrderFulfillmentsResponse, CreateOrderFulfillmentRequest } from './order-fulfillments.response';
import { OrderFulfillment } from '../model/order-fulfillment.entity';
import { OrderFulfillmentAssembler } from './order-fulfillment.assembler';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OrderFulfillmentService {
  private readonly apiUrl = `${environment.serverBaseUrl}/api/v1/fulfillments`;

  constructor(private http: HttpClient) {}


  getAll(manufacturerId: string): Observable<OrderFulfillment[]> {
    return this.http.get<OrderFulfillmentsResponse>(`${this.apiUrl}?manufacturerId=${manufacturerId}`).pipe(
      map(responses => responses.map(OrderFulfillmentAssembler.fromResponse))
    );
  }

  getById(fulfillmentId: string): Observable<OrderFulfillment> {
    return this.http.get<OrderFulfillmentResponse>(`${this.apiUrl}/${fulfillmentId}`).pipe(
      map(OrderFulfillmentAssembler.fromResponse)
    );
  }

  create(request: CreateOrderFulfillmentRequest): Observable<OrderFulfillment> {
    return this.http.post<OrderFulfillmentResponse>(this.apiUrl, request).pipe(
      map(OrderFulfillmentAssembler.fromResponse)
    );
  }
}
