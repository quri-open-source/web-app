import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cart } from '../model/cart.entity';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CartService {
  constructor(private http: HttpClient) {}

  getCartByUser(userId: string): Observable<Cart[]> {
    return this.http.get<Cart[]>(`${environment.apiBaseUrl}/carts?user_id=${userId}`);
  }

  updateCart(cart: Cart): Observable<Cart> {
    return this.http.put<Cart>(`${environment.apiBaseUrl}/carts/${cart.id}`, cart);
  }

  clearCart(cart: Cart): Observable<Cart> {
    const clearedCart = { ...cart, items: [] };
    return this.http.put<Cart>(`${environment.apiBaseUrl}/carts/${cart.id}`, clearedCart);
  }
}