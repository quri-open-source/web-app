import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RoleDomainService {
  private currentRoleSubject = new BehaviorSubject<string | null>(null);

  get currentRole$(): Observable<string | null> {
    return this.currentRoleSubject.asObservable();
  }

  setRole(role: string): void {
    this.currentRoleSubject.next(role);
  }

  getCurrentRole(): string | null {
    return this.currentRoleSubject.value;
  }
}
