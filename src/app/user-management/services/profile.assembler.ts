

import { Profile } from "../model/profile.entity";
import { AddressAssembler } from "./address.assembler";
import {  ProfileResponse } from "./user.response";

export class ProfileAssembler {

    static toEntityFromResponse(response: ProfileResponse): Profile {
        const addresses = AddressAssembler.toEntitiesFromResponse(response.addresses);

        return new Profile(
            response.first_name,
            response.last_name,
            response.gender,
            addresses
        );
    }

    static toEntitiesFromResponse(responses: ProfileResponse[]): Profile[] {
        return responses.map(response => this.toEntityFromResponse(response));
    }
}
