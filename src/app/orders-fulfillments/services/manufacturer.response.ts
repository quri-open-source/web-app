import { Manufacturer } from '../model/manufacturer.entity';

export interface ManufacturerResponse {
  id: string;
  userId: string;
  name: string;
  address: string;
  city: string;
  country: string;
  state: string;
  zip: string;
}

export interface ManufacturerListResponse {
  manufacturers: ManufacturerResponse[];
}

export interface CreateFulfillmentRequest {
  orderId: string;
  manufacturerId: string;
  status?: string;
  receivedDate?: string;
  shippedDate?: string | null;
}

export interface CreateFulfillmentResponse {
  id: string;
  orderId: string;
  status: string;
  receivedDate: string;
  shippedDate: string | null;
  manufacturerId: string;
}
