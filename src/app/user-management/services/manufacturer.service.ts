import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ManufacturerProfile {
  id: string;
  user_id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  state: string;
  zip: string;
}

@Injectable({ providedIn: 'root' })
export class ManufacturerService {
  private apiUrl = environment.apiBaseUrl + '/manufacturers';

  constructor(private http: HttpClient) {}

  getManufacturerByUserId(userId: string): Observable<ManufacturerProfile[]> {
    return this.http.get<ManufacturerProfile[]>(`${this.apiUrl}?user_id=${userId}`);
  }

  updateManufacturer(id: string, data: Partial<ManufacturerProfile>): Observable<ManufacturerProfile> {
    return this.http.put<ManufacturerProfile>(`${this.apiUrl}/${id}`, data);
  }
}
