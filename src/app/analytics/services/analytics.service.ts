import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AnalyticsData } from '../model/analytics-data.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  constructor(private http: HttpClient) {}

  getUserAnalytics(userId: string): Observable<AnalyticsData | null> {
    return this.http.get<any[]>(`${environment.apiBaseUrl}/analytics?user_id=${userId}`)
      .pipe(
        map(response => {
          if (response && response.length > 0) {
            const data = response[0];
            return {
              userId: data.user_id,
              totalProjects: data.total_projects,
              blueprints: data.blueprints,
              designedGarments: data.designed_garments,
              completed: data.completed
            } as AnalyticsData;
          }
          return null;
        })
      );
  }
}
