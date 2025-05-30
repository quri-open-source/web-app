import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';



@Injectable({ providedIn: 'root' })
export class AuthService {
  // In a real app, this would come from a login/session/JWT
  getCurrentUserId(): string {
    // TODO: Replace with real logic
    return environment.defaultUserId;
  }
}
