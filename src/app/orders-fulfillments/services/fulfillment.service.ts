import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BaseService } from '../../shared/services/base.service';
import { Fulfillment } from '../model/fulfillment.entity';
import { FulfillmentAssembler } from './fulfillment.assembler';
import { FulfillmentResponse } from './fulfillment.response';

@Injectable({
  providedIn: 'root'
})
export class FulfillmentService extends BaseService<FulfillmentResponse> {
  constructor() {
    super('fulfillments');
  }

  getAllFulfillments(): Observable<Fulfillment[]> {
    return this.getAll().pipe(
      map((response: FulfillmentResponse[]) =>
        response.map(fulfillmentResponse =>
          FulfillmentAssembler.toEntityFromResource(fulfillmentResponse)
        )
      )
    );
  }
  
  getFulfillmentsByManufacturer(manufacturerId: string): Observable<Fulfillment[]> {
    return this.http.get<FulfillmentResponse[]>(`${this.resourcePath()}?manufacturer_id=${manufacturerId}`).pipe(
      map((response: FulfillmentResponse[]) =>
        response.map(fulfillmentResponse =>
          FulfillmentAssembler.toEntityFromResource(fulfillmentResponse)
        )
      )
    );
  }
  
  getFulfillmentsByOrder(orderId: string): Observable<Fulfillment[]> {
    return this.http.get<FulfillmentResponse[]>(`${this.resourcePath()}?order_id=${orderId}`).pipe(
      map((response: FulfillmentResponse[]) =>
        response.map(fulfillmentResponse =>
          FulfillmentAssembler.toEntityFromResource(fulfillmentResponse)
        )
      )
    );
  }
  
  getFulfillmentById(id: string): Observable<Fulfillment> {
    return this.getById(id).pipe(
      map((response: FulfillmentResponse) =>
        FulfillmentAssembler.toEntityFromResource(response)
      )
    );
  }
  
  createFulfillment(fulfillment: Partial<Fulfillment>): Observable<Fulfillment> {
    const fulfillmentResponse = FulfillmentAssembler.toResourceFromEntity(fulfillment as Fulfillment);
    return this.create(fulfillmentResponse).pipe(
      map((response: FulfillmentResponse) =>
        FulfillmentAssembler.toEntityFromResource(response)
      )
    );
  }
  
  updateFulfillment(id: string, fulfillment: Partial<Fulfillment>): Observable<Fulfillment> {
    const fulfillmentResponse = FulfillmentAssembler.toResourceFromEntity(fulfillment as Fulfillment);
    return this.update(id, fulfillmentResponse).pipe(
      map((response: FulfillmentResponse) =>
        FulfillmentAssembler.toEntityFromResource(response)
      )
    );
  }
}
