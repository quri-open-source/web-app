import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Fulfillment } from '../model/fulfillment.entity';
import { FulfillmentAssembler } from './fulfillment.assembler';
import { FulfillmentResponse } from './fulfillment.response';

@Injectable({
  providedIn: 'root'
})
export class FulfillmentService {
  private http = inject(HttpClient);
  private baseUrl = environment.serverBaseUrl;
  private resourceEndpoint = 'fulfillments';

  private getResourceUrl(): string {
    return `${this.baseUrl}/${this.resourceEndpoint}`;
  }

  getAllFulfillments(): Observable<Fulfillment[]> {
    return this.http.get<FulfillmentResponse[]>(this.getResourceUrl()).pipe(
      map((response: FulfillmentResponse[]) =>
        response.map(fulfillmentResponse =>
          FulfillmentAssembler.toEntityFromResource(fulfillmentResponse)
        )
      )
    );
  }

  getFulfillmentsByManufacturer(manufacturerId: string): Observable<Fulfillment[]> {
    return this.http.get<FulfillmentResponse[]>(`${this.getResourceUrl()}?manufacturer_id=${manufacturerId}`).pipe(
      map((response: FulfillmentResponse[]) =>
        response.map(fulfillmentResponse =>
          FulfillmentAssembler.toEntityFromResource(fulfillmentResponse)
        )
      )
    );
  }

  getFulfillmentsByOrder(orderId: string): Observable<Fulfillment[]> {
    return this.http.get<FulfillmentResponse[]>(`${this.getResourceUrl()}?order_id=${orderId}`).pipe(
      map((response: FulfillmentResponse[]) =>
        response.map(fulfillmentResponse =>
          FulfillmentAssembler.toEntityFromResource(fulfillmentResponse)
        )
      )
    );
  }

  getFulfillmentById(id: string): Observable<Fulfillment> {
    return this.http.get<FulfillmentResponse>(`${this.getResourceUrl()}/${id}`).pipe(
      map((response: FulfillmentResponse) =>
        FulfillmentAssembler.toEntityFromResource(response)
      )
    );
  }

  createFulfillment(fulfillment: Partial<Fulfillment>): Observable<Fulfillment> {
    const fulfillmentResponse = FulfillmentAssembler.toResourceFromEntity(fulfillment as Fulfillment);
    return this.http.post<FulfillmentResponse>(this.getResourceUrl(), fulfillmentResponse).pipe(
      map((response: FulfillmentResponse) =>
        FulfillmentAssembler.toEntityFromResource(response)
      )
    );
  }

  updateFulfillment(id: string, fulfillment: Partial<Fulfillment>): Observable<Fulfillment> {
    const fulfillmentResponse = FulfillmentAssembler.toResourceFromEntity(fulfillment as Fulfillment);
    return this.http.put<FulfillmentResponse>(`${this.getResourceUrl()}/${id}`, fulfillmentResponse).pipe(
      map((response: FulfillmentResponse) =>
        FulfillmentAssembler.toEntityFromResource(response)
      )
    );
  }
}
