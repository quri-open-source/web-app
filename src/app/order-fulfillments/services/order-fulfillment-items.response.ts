

// get all fulfillment items by fulfillmentId
// api/v1/fulfillment/{fulfillmentId}/items
export interface OrderFulfillmentItemsRequest {
    fulfillmentId: string; // en el path
}

export enum OrderFulfillmentItemStatus {
    PENDING = 'PENDING',
    SHIPPED = 'SHIPPED',
    RECEIVED = 'RECEIVED',
    CANCELLED = 'CANCELLED'
}

// patch the fulfillment item status
// api/v1/fulfillment/{fulfillmentId}/items/{itemId}
export interface UpdateOrderFulfillmentItemStatusRequest {
    updateTo: OrderFulfillmentItemStatus;
}
export interface FulfillmentItemResponse {
    id: string;
    fulfillmentId: string;
    productId: string;
    quantity: number;
    status: OrderFulfillmentItemStatus;
}

