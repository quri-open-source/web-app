import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { FulfillmentItemResponse, OrderFulfillmentItemsRequest, UpdateOrderFulfillmentItemStatusRequest } from './order-fulfillment-items.response';
import { FulfillmentItem } from '../model/fulfillment-item.entity';
import { FulfillmentItemAssembler } from './fulfillment-item.assembler';

@Injectable({ providedIn: 'root' })
export class FulfillmentItemService {
  private readonly apiUrl = '/api/v1/fulfillment';

  constructor(private http: HttpClient) {}

  getAllByFulfillmentId(fulfillmentId: string): Observable<FulfillmentItem[]> {
    return this.http.get<FulfillmentItemResponse[]>(`${this.apiUrl}/${fulfillmentId}/items`).pipe(
      map(responses => responses.map(FulfillmentItemAssembler.fromResponse))
    );
  }

  updateStatus(fulfillmentId: string, itemId: string, request: UpdateOrderFulfillmentItemStatusRequest): Observable<FulfillmentItem> {
    return this.http.patch<FulfillmentItemResponse>(`${this.apiUrl}/${fulfillmentId}/items/${itemId}`, request).pipe(
      map(FulfillmentItemAssembler.fromResponse)
    );
  }
}
