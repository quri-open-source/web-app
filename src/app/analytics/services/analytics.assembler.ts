import { AnalyticsData } from '../model/analytics.entity';
import { AnalyticsResponse } from './analytics.response';

export class AnalyticsAssembler {
  static toEntity(response: AnalyticsResponse): AnalyticsData {
    return new AnalyticsData({
      userId: response.user_id,
      totalProjects: response.total_projects,
      blueprints: response.blueprints,
      designedGarments: response.designed_garments,
      completed: response.completed
    });
  }

  static toResponse(entity: AnalyticsData): AnalyticsResponse {
    return {
      user_id: entity.userId,
      total_projects: entity.totalProjects,
      blueprints: entity.blueprints,
      designed_garments: entity.designedGarments,
      completed: entity.completed
    };
  }
}
