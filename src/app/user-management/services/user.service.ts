import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BaseService } from '../../shared/services/base.service';
import { UserResponse } from './user.response';
import { map } from 'rxjs';
import { UserAssembler } from './user.assembler';

const USER_WITH_PROFILE = (id: string) =>
    `http://localhost:3000/userWithProfile?id=${id}`;

@Injectable({
    providedIn: 'root',
})
export class UserService extends BaseService<UserResponse> {
    private userId: string = environment.devUser;
    constructor() {
        super('users');
    }

    // Define user properties and methods here
    getSessionUserId(): string {
        return this.userId;
    }

    getCurrentUser() {
        return this.http
            .get<UserResponse[]>(USER_WITH_PROFILE(this.userId))
            .pipe(map((response) => UserAssembler.toEntityFromResponse(response[0])));
    }
}
