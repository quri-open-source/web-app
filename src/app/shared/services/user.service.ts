import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../../core/model/user.entity';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'http://localhost:3000'; // Cambia la URL para apuntar a json-server
  private userId = 'user-001'; // Simulación de usuario logueado

  constructor(private http: HttpClient) {}

  getCurrentUser(): Observable<User> {
    return this.http.get<User[]>(`${this.apiUrl}/users?id=${this.userId}`).pipe(
      map(users => users[0])
    );
  }

  updateUser(user: User): Observable<User> {
    // Realiza un PATCH real a la fake API
    return this.http.patch<User>(`${this.apiUrl}/users/${user.id}`, user);
  }
}
