import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private apiUrl = `${environment.apiBaseUrl}/orders`;

  constructor(private http: HttpClient) {}

  getOrdersByUser(userId: string): Observable<any[]> {
    // Returns only the orders belonging to the given user
    return this.http.get<any[]>(`${this.apiUrl}?user_id=${userId}`);
  }
}

