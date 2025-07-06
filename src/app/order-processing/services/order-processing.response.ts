// api/v1/orders?userId=uuuuu-uuuu-uuuu-uuuuuuuuuuuu
// GET
export type UserOrdersResponse = OrderResponse[];
export type OrderResponseStatus = "COMPLETED" | "PROCESSING"


export interface ItemResponse {
    id: string;
    productId: string;
    quantity: number;
}

export interface OrderResponse {
    id: string;
    userId: string;
    orderStatus: OrderResponseStatus;
    items: ItemResponse[];
}



// Create order
// POST // /api/v1/orders
export interface CreateOrderRequest {
    userId: string;
    items: CreateOrderItemRequest[];
}
export interface CreateOrderItemRequest {
    productId: string;
    quantity: number;
}


// POST Stripe payment intent secret key
// POST // /api/v1/orders/payment-intents
export interface CreateOrderPaymentIntentRequest {
    amount: number; // Amount in cents
    currency: string; // e.g., "usd"
}

export interface CreateOrderPaymentIntentResponse {
    secretKey: string; // The client secret for the payment intent
}


// GET order by ID
// GET // /api/v1/orders/{orderId}
export interface OrderByIdRequest {
    orderId: string; // used in the URL
}

export interface OrderByIdResponse {
    id: string;
    userId: string;
    orderStatus: OrderResponseStatus;
    items: ItemResponse[];
}
