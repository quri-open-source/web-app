import { Profile } from './profile.entity';

export class User {
    id: string;
    email: string;
    token: string;
    profile: Profile;
    rol: string;

    constructor(
        id: string,
        email: string,
        token: string,
        rol: string,
        profile: Profile,
    ) {
        this.id = id;
        this.email = email;
        this.token = token;
        this.profile = profile;
        this.rol = rol;
    }
}
