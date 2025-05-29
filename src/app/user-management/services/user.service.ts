import { Injectable } from '@angular/core';
import { UserEntity } from '../model/user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'http://localhost:3000/users'; // Ajusta si tu endpoint es diferente

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
