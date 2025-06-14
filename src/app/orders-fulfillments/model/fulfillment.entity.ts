export class Fulfillment {
  id: string;
  order_id: string;
  status: string;
  received_date: string;
  shipped_date: string | null;
  manufacturer_id: string;

  constructor(fulfillment: {
    id?: string;
    order_id?: string;
    status?: string;
    received_date?: string;
    shipped_date?: string | null;
    manufacturer_id?: string;
  }) {
    this.id = fulfillment.id || '';
    this.order_id = fulfillment.order_id || '';
    this.status = fulfillment.status || 'pending';
    this.received_date = fulfillment.received_date || new Date().toISOString();
    this.shipped_date = fulfillment.shipped_date || null;
    this.manufacturer_id = fulfillment.manufacturer_id || '';
  }
}
