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
  // Utility methods
  get formattedReceivedDate(): string {
    return new Date(this.received_date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  get formattedShippedDate(): string {
    if (!this.shipped_date) return 'Not shipped';
    return new Date(this.shipped_date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  get statusDisplayName(): string {
    switch (this.status.toLowerCase()) {
      case 'pending':
        return 'Pending';
      case 'processing':
        return 'Processing';
      case 'shipped':
        return 'Shipped';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return this.status;
    }
  }
}
