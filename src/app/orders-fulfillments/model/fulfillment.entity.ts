export class Fulfillment {
  id: string;
  orderId: string;
  status: string;
  receivedDate: string;
  shippedDate: string | null;
  manufacturerId: string;
  createdAt: string;
  updatedAt: string;

  constructor(fulfillment: {
    id?: string;
    orderId?: string;
    status?: string;
    receivedDate?: string;
    shippedDate?: string | null;
    manufacturerId?: string;
    createdAt?: string;
    updatedAt?: string;
  }) {
    this.id = fulfillment.id || '';
    this.orderId = fulfillment.orderId || '';
    this.status = fulfillment.status || 'pending';
    this.receivedDate = fulfillment.receivedDate || new Date().toISOString();
    this.shippedDate = fulfillment.shippedDate || null;
    this.manufacturerId = fulfillment.manufacturerId || '';
    this.createdAt = fulfillment.createdAt || new Date().toISOString();
    this.updatedAt = fulfillment.updatedAt || new Date().toISOString();
  }
  // Utility methods
  get formattedReceivedDate(): string {
    return new Date(this.receivedDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  get formattedShippedDate(): string {
    if (!this.shippedDate) return 'Not shipped';
    return new Date(this.shippedDate).toLocaleDateString('en-US', {
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
