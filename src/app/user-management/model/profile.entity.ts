import { Address } from './address.entity';

export class Profile {
    firstName: string;
    lastName: string;
    gender: string;
    addresses: Address[];

    constructor(
        firstName: string,
        lastName: string,
        gender: string,
        addresses: Address[]
    ) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.gender = gender;
        this.addresses = addresses;
    }

    getFullName(): string {
        return `${this.firstName || ''} ${this.lastName || ''}`.trim();
    }
}
