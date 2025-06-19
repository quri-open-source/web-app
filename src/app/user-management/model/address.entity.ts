

export class Address {
    id: string;
    profileId: string;
    address: string;
    city: string;
    country: string;
    state: string;
    zip: string;

    constructor(id: string, profileId: string, address: string, city: string, country: string, state: string, zip: string) {
        this.id = id;
        this.profileId = profileId;
        this.address = address;
        this.city = city;
        this.country = country;
        this.state = state;
        this.zip = zip;
    }

    formatAddress(): string {
        const parts = [
            this.address,
            this.city,
            this.state,
            this.zip,
            this.country
        ].filter(part => part && part.trim());


        return parts.join(', ');
    }
}
