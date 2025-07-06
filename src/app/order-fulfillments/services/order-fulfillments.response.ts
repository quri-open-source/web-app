export enum OrderFulfillmentStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED'
}

// Get all fulfillments by manufacturerId
// Endpoint: api/v1/fulfillments?manufacturerId=...
export interface OrderFulfillmentsRequest {
    manufacturerId: string; // in query params
}
// Response type
export type OrderFulfillmentsResponse = OrderFulfillmentResponse[];

export interface OrderFulfillmentResponse {
    id: string;
    orderId: string;
    status: OrderFulfillmentStatus;
    receivedDate: Date;
    shippedDate: Date;
    manufacturerId: string;
    createdAt: Date;
    updatedAt: Date;
}

// Get fulfillment by ID
// Endpoint: api/v1/fulfillments/{fulfillmentId}
export interface OrderFulfillmentByIdRequest {
    fulfillmentId: string; // in path param
}
// Response type for this endpoint
export type OrderFulfillmentByIdResponse = OrderFulfillmentResponse;


// Create fulfillment
// Endpoint: api/v1/fulfillments
export interface CreateOrderFulfillmentRequest {
    orderId: string; // in request body
    manufacturerId: string; // in request body
}
// Response type for this endpoint
export type CreateOrderFulfillmentResponse = OrderFulfillmentResponse;
