export interface FulfillmentResponse {
  id: string;
  order_id: string;
  status: string;
  received_date: string;
  shipped_date: string | null;
  manufacturer_id: string;
}
