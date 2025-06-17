import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface User {
  id: string;
  name: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class UserDomainService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  setUser(user: User) {
    this.currentUserSubject.next(user);
  }

  setRole(role: string) {
    const user = this.currentUserSubject.value;
    if (user) {
      this.currentUserSubject.next({ ...user, role });
    }
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
