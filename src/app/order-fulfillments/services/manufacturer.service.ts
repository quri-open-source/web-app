import { Injectable } from '@angular/core';
import { Manufacturer } from '../model/manufacturer.entity';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ManufacturerResponse, ManufacturersResponse, CreateManufacturerRequest } from './manufacturer.response';
import { ManufacturerAssembler } from './manufacturer.assembler';

@Injectable({ providedIn: 'root' })
export class ManufacturerService {
  private readonly apiUrl = '/api/v1/manufacturers';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Manufacturer[]> {
    return this.http.get<ManufacturersResponse>(this.apiUrl).pipe(
      map(responses => responses.map(ManufacturerAssembler.fromResponse))
    );
  }

  create(request: CreateManufacturerRequest): Observable<Manufacturer> {
    return this.http.post<ManufacturerResponse>(this.apiUrl, request).pipe(
      map(ManufacturerAssembler.fromResponse)
    );
  }
  getByUserId(userId: string): Observable<Manufacturer> {
    // Endpoint: /api/v1/manufacturers/{userId}/details
    return this.http.get<ManufacturerResponse>(`${this.apiUrl}/${userId}/details`).pipe(
      map(ManufacturerAssembler.fromResponse)
    );
  }
}
