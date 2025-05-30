

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserEntity } from '../model/user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = `${environment.apiBaseUrl}/users`;

  constructor(private http: HttpClient) {}

  createUser(dto: CreateUserDto): Observable<UserEntity> {
    return this.http.post<UserEntity>(this.apiUrl, dto);
  }

  getUsers(): Observable<UserEntity[]> {
    return this.http.get<UserEntity[]>(this.apiUrl);
  }

  updateUser(user: Partial<UserEntity> & { id: string }): Observable<UserEntity> {
    return this.http.patch<UserEntity>(`${this.apiUrl}/${user.id}`, user);
  }
}
