import { Manufacturer } from '../model/manufacturer.entity';

export interface ManufacturerResponse {
  id: string;
  user_id: string;
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
  order_id: string;
  manufacturer_id: string;
  status?: string;
  received_date?: string;
  shipped_date?: string | null;
}

export interface CreateFulfillmentResponse {
  id: string;
  order_id: string;
  status: string;
  received_date: string;
  shipped_date: string | null;
  manufacturer_id: string;
}
