
import { Address } from "../model/address.entity";
import { AddressResponse } from "./user.response";

export class AddressAssembler {

    static toEntityFromResponse(response: AddressResponse): Address {
        return new Address(
            response.id,
            response.profile_id,
            response.address,
            response.city,
            response.country,
            response.state,
            response.zip
        );
    }

    static toEntitiesFromResponse(responses: AddressResponse[]): Address[] {
        return responses.map(response => this.toEntityFromResponse(response));
    }
}
