import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { FulfillmentItemResponse, UpdateOrderFulfillmentItemStatusRequest } from './order-fulfillment-items.response';
import { FulfillmentItem } from '../model/fulfillment-item.entity';
import { FulfillmentItemAssembler } from './fulfillment-item.assembler';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FulfillmentItemService {
  private readonly apiUrl = `${environment.serverBaseUrl}/api/v1/fulfillments`;

  constructor(private http: HttpClient) {}

  getAllByFulfillmentId(fulfillmentId: string): Observable<FulfillmentItem[]> {
    return this.http.get<FulfillmentItemResponse[]>(`${this.apiUrl}/${fulfillmentId}/items`).pipe(
      map(responses => responses.map(FulfillmentItemAssembler.fromResponse))
    );
  }

  getRawItemsByFulfillmentId(fulfillmentId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${fulfillmentId}/items`);
  }

  updateStatus(fulfillmentId: string, itemId: string, request: UpdateOrderFulfillmentItemStatusRequest): Observable<FulfillmentItem> {
    return this.http.patch<FulfillmentItemResponse>(`${this.apiUrl}/${fulfillmentId}/items/${itemId}`, request).pipe(
      map(FulfillmentItemAssembler.fromResponse)
    );
  }
}
