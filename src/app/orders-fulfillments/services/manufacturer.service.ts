import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BaseService } from '../../access-security/services/access.service';
import { Manufacturer } from '../model/manufacturer.entity';
import { Fulfillment } from '../model/fulfillment.entity';
import { ManufacturerAssembler } from './manufacturer.assembler';
import { FulfillmentAssembler } from './fulfillment.assembler';
import {
  ManufacturerResponse,
  CreateFulfillmentRequest,
  CreateFulfillmentResponse
} from './manufacturer.response';

@Injectable({
  providedIn: 'root'
})
export class ManufacturerService extends BaseService<ManufacturerResponse> {
  constructor() {
    super('/manufacturers');
  }

  getAllManufacturers(): Observable<Manufacturer[]> {
    return this.getAll().pipe(
      map((response: ManufacturerResponse[]) =>
        response.map(manufacturerResponse =>
          ManufacturerAssembler.toEntityFromResource(manufacturerResponse)
        )
      )
    );
  }

  getManufacturerById(id: string): Observable<Manufacturer> {
    return this.getById(id).pipe(
      map((response: ManufacturerResponse) =>
        ManufacturerAssembler.toEntityFromResource(response)
      )
    );
  }
  createFulfillment(request: CreateFulfillmentRequest): Observable<Fulfillment> {
    const fulfillmentData = {
      id: this.generateId(),
      ...request,
      status: request.status || 'pending',
      received_date: request.received_date || new Date().toISOString(),
      shipped_date: request.shipped_date || null
    };

    return this.http.post<CreateFulfillmentResponse>(`${this.apiUrl}/fulfillments`, fulfillmentData).pipe(
      map((response: CreateFulfillmentResponse) =>
        FulfillmentAssembler.toEntityFromResource(response)
      )
    );
  }

  private generateId(): string {
    return `fulfillment-${Math.random().toString(36).substr(2, 9)}`;
  }
}
