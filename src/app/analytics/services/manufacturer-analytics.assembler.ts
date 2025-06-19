import { ManufacturerAnalyticsData } from '../model/manufacturer-analytics.entity';
import { ManufacturerAnalyticsResponse } from './manufacturer-analytics.response';

export class ManufacturerAnalyticsAssembler {
  static toEntity(response: ManufacturerAnalyticsResponse): ManufacturerAnalyticsData {
    return new ManufacturerAnalyticsData({
      userId: response.user_id,
      totalOrdersReceived: response.total_orders_received,
      pendingFulfillments: response.pending_fulfillments,
      producedProjects: response.produced_projects,
      avgFulfillmentTimeDays: response.avg_fulfillment_time_days
    });
  }
}
