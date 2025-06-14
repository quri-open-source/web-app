export class Manufacturer {
  id: string;
  user_id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  state: string;
  zip: string;

  constructor(manufacturer: {
    id?: string;
    user_id?: string;
    name?: string;
    address?: string;
    city?: string;
    country?: string;
    state?: string;
    zip?: string;
  }) {
    this.id = manufacturer.id || '';
    this.user_id = manufacturer.user_id || '';
    this.name = manufacturer.name || '';
    this.address = manufacturer.address || '';
    this.city = manufacturer.city || '';
    this.country = manufacturer.country || '';
    this.state = manufacturer.state || '';
    this.zip = manufacturer.zip || '';
  }

  get fullAddress(): string {
    return `${this.address}, ${this.city}, ${this.state} ${this.zip}, ${this.country}`;
  }
}
