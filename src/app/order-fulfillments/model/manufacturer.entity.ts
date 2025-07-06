// Manufacturer Entity - DDD & OOP best practices
export class Manufacturer {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public name: string,
    public address: string,
    public city: string,
    public country: string,
    public state: string,
    public zip: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  // Example domain logic
  updateAddress(newAddress: string, newCity: string, newState: string, newZip: string, newCountry: string) {
    this.address = newAddress;
    this.city = newCity;
    this.state = newState;
    this.zip = newZip;
    this.country = newCountry;
  }
}
