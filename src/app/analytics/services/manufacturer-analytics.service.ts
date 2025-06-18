import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ManufacturerAnalyticsResponse } from './manufacturer-analytics.response';
import { ManufacturerAnalyticsData } from '../model/manufacturer-analytics.entity';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ManufacturerAnalyticsAssembler } from './manufacturer-analytics.assembler';

@Injectable({ providedIn: 'root' })
export class ManufacturerAnalyticsService {
  // Cambia la URL para que apunte a la colección correcta en el backend json-server
  private apiUrl = environment.apiBaseUrl + '/manufacturer_analytics';

  constructor(private http: HttpClient) {}

  getUserAnalytics(userId: string): Observable<ManufacturerAnalyticsData> {
    return this.http.get<ManufacturerAnalyticsResponse[]>(`${this.apiUrl}?user_id=${userId}`)
      .pipe(
        map(responses => ManufacturerAnalyticsAssembler.toEntity(responses[0]))
      );
  }
}
