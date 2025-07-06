export enum OrderFulfillmentStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED'
}

// get all fulfillments by manufacturerId
// api/v1/fulfillments?manufacturerId=...
export interface OrderFulfillmentsRequest {
    manufacturerId: string; // en el query
}
// recibe como response
export type OrderFulfillmentsResponse = OrderFulfillmentResponse[];

export interface OrderFulfillmentResponse {
    id: string;
    orderId: string;
    fulfillmentStatus: OrderFulfillmentStatus;
    receivedDate: Date;
    shippedDate: Date;
    manufacturerId: string;
    createdAt: Date;
    updatedAt: Date;
}

// get fulfillment by id
// api/v1/fulfillments/{fulfillmentId}
export interface OrderFulfillmentByIdRequest {
    fulfillmentId: string; // en el path
}
// este endpoint recibe como response
export type OrderFulfillmentByIdResponse = OrderFulfillmentResponse;


// create fulfillment
// api/v1/fulfillments
export interface CreateOrderFulfillmentRequest {
    orderId: string; // en el body
    manufacturerId: string; // en el body
}
// este endpoint recibe como response
export type CreateOrderFulfillmentResponse = OrderFulfillmentResponse;
