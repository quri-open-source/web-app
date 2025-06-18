export interface ManufacturerAnalyticsResponse {
  user_id: string;
  total_orders_received: number;
  pending_fulfillments: number;
  produced_projects: number;
  avg_fulfillment_time_days: number;
}
