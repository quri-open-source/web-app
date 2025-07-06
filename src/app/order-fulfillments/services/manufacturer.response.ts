export interface ManufacturerResponse {
    id: string;
    userId: string;
    name: string;
    address: string;
    city: string;
    country: string;
    state: string;
    zip: string;
    createdAt: string; // convert to Date
    updatedAt: string; // convert to Date
}

// get api/v1/manufacturers
// get all manufacturers
export type ManufacturersResponse = ManufacturerResponse[];

// post api/v1/manufacturers
// create manufacturer
export interface CreateManufacturerRequest {
    userId: string;
    name: string;
    address: string;
    city: string;
    country: string;
    state: string;
    zip: string;
}

