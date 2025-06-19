

export interface UserResponse {
    id: string;
    email: string;
    token: string;
    profile: ProfileResponse;
    rol: string;
}

export interface ProfileResponse {
    id: string;
    user_id: string;
    first_name: string;
    last_name: string;
    gender: string;
    addresses: AddressResponse[];
}

export interface AddressResponse {
    id: string;
    profile_id: string;
    address: string;
    city: string;
    country: string;
    state: string;
    zip: string;
}
