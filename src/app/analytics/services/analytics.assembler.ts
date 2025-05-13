import { Analytics } from '../model/analytics.entity';
import { AnalyticsResponse } from './analytics.response';

export class AnalyticsAssembler {
    static ToEntityFromResponse(response: AnalyticsResponse): Analytics {
        return {
            id: response.id,
            userId: response.user_id,
            projectId: response.project_id,
            garmentSize: response.garment_size,
            garmentColor: response.garment_color,
            createdAt: new Date(response.created_at),
            lastModified: new Date(response.last_modified),
            pageViews: response.page_views,
            totalLikes: response.total_likes,
            clickCount: response.click_count,
            conversionRate: response.conversion_rate
        } as Analytics;
    }

    static ToEntitiesFromResponse(response: AnalyticsResponse[]): Analytics[] {
        return response.map((analyticsResponse) => {
            return AnalyticsAssembler.ToEntityFromResponse(analyticsResponse);
        });
    }
}