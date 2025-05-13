import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { Analytics } from '../model/analytics.entity';
import { map, Observable } from 'rxjs';
import { AnalyticsAssembler } from './analytics.assembler';
import { AnalyticsResponse } from './analytics.response';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService extends BaseService<Analytics> {
  constructor() {
    super('/analytics');
  }

  public getAnalyticsByUserId(userId: string): Observable<Analytics[]> {
    return this.http
      .get<AnalyticsResponse[]>(`${this.resourcePath()}`, {
        params: {
          user_id: userId,
        },
      })
      .pipe(
        map((response) => {
          return AnalyticsAssembler.ToEntitiesFromResponse(response);
        })
      );
  }

  public getAnalyticsByProjectId(projectId: string): Observable<Analytics[]> {
    return this.http
      .get<AnalyticsResponse[]>(`${this.resourcePath()}`, {
        params: {
          project_id: projectId,
        },
      })
      .pipe(
        map((response) => {
          return AnalyticsAssembler.ToEntitiesFromResponse(response);
        })
      );
  }

  public createAnalytics(analytics: Analytics): Observable<Analytics> {
    return this.create(analytics).pipe(
      map((response: any) => {
        return AnalyticsAssembler.ToEntityFromResponse(response);
      })
    );
  }

  public updateAnalytics(id: string, analytics: Analytics): Observable<Analytics> {
    return this.update(id, analytics).pipe(
      map((response: any) => {
        return AnalyticsAssembler.ToEntityFromResponse(response);
      })
    );
  }
}