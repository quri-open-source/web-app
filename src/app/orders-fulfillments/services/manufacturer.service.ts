import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
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
export class ManufacturerService {
  private http = inject(HttpClient);
  private baseUrl = environment.serverBaseUrl;
  private resourceEndpoint = 'manufacturers';

  private getResourceUrl(): string {
    return `${this.baseUrl}/${this.resourceEndpoint}`;
  }

  getAllManufacturers(): Observable<Manufacturer[]> {
    return this.http.get<ManufacturerResponse[]>(this.getResourceUrl()).pipe(
      map((response: ManufacturerResponse[]) =>
        response.map(manufacturerResponse =>
          ManufacturerAssembler.toEntityFromResource(manufacturerResponse)
        )
      )
    );
  }

  getManufacturerById(id: string): Observable<Manufacturer> {
    return this.http.get<ManufacturerResponse>(`${this.getResourceUrl()}/${id}`).pipe(
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

    return this.http.post<CreateFulfillmentResponse>(`${this.baseUrl}/fulfillments`, fulfillmentData).pipe(
      map((response: CreateFulfillmentResponse) =>
        FulfillmentAssembler.toEntityFromResource(response)
      )
    );
  }

  private generateId(): string {
    return `fulfillment-${Math.random().toString(36).substr(2, 9)}`;
  }
}
