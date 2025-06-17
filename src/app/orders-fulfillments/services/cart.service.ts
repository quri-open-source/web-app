import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, switchMap, BehaviorSubject } from 'rxjs';
import { Cart, CartItem } from '../model/cart.entity';
import { environment } from '../../../environments/environment';
import { Product } from '../../product-catalog/model/product.entity';

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartChanged$ = new BehaviorSubject<Cart | null>(null);

  constructor(private http: HttpClient) {}

  getCartByUser(userId: string): Observable<Cart[]> {
    return this.http.get<Cart[]>(`${environment.apiBaseUrl}/carts?user_id=${userId}`);
  }

  getCartUpdates(): Observable<Cart | null> {
    return this.cartChanged$.asObservable();
  }

  updateCart(cart: Cart): Observable<Cart> {
    return this.http.put<Cart>(`${environment.apiBaseUrl}/carts/${cart.id}`, cart).pipe(
      map((updatedCart) => {
        this.cartChanged$.next(updatedCart);
        return updatedCart;
      })
    );
  }

  clearCart(cart: Cart): Observable<Cart> {
    const clearedCart = { ...cart, items: [] };
    return this.http.put<Cart>(`${environment.apiBaseUrl}/carts/${cart.id}`, clearedCart).pipe(
      map((updatedCart) => {
        this.cartChanged$.next(updatedCart);
        return updatedCart;
      })
    );
  }

  addToCart(product: Product, userId: string): Observable<Cart> {
    return this.getCartByUser(userId).pipe(
      map((carts) => carts[0]),
      switchMap((cart) => {
        if (!cart) {
          const newCart: Cart = {
            id: '',
            user_id: userId,
            items: [],
            applied_discounts: []
          };
          return this.createCartWithProduct(newCart, product);
        }
        const existingItem = cart.items.find(item => item.project_id === product.projectId);
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          const newItem = new CartItem();
          newItem.project_id = product.projectId;
          newItem.quantity = 1;
          newItem.unit_price = product.price;
          newItem.projectName = product.projectDetails?.name || '';
          newItem.projectImage = product.projectDetails?.previewImageUrl || environment.defaultPreviewImageUrl;
          cart.items.push(newItem);
        }
        return this.updateCart(cart);
      })
    );
  }

  private createCartWithProduct(cart: Cart, product: Product): Observable<Cart> {
    const newItem = new CartItem();
    newItem.project_id = product.projectId;
    newItem.quantity = 1;
    newItem.unit_price = product.price;
    newItem.projectName = product.projectDetails?.name || '';
    newItem.projectImage = product.projectDetails?.previewImageUrl || environment.defaultPreviewImageUrl;
    cart.items = [newItem];
    return this.http.post<Cart>(`${environment.apiBaseUrl}/carts`, cart).pipe(
      map((createdCart) => {
        this.cartChanged$.next(createdCart);
        return createdCart;
      })
    );
  }
}