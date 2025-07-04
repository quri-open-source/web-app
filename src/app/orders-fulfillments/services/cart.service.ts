import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, switchMap, BehaviorSubject, of } from 'rxjs';
import { Cart, CartItem } from '../model/cart.entity';
import { environment } from '../../../environments/environment';
import { Product } from '../../product-catalog/model/product.entity';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly LOCAL_CART_KEY = 'shopping_cart';
  private cartChanged$ = new BehaviorSubject<Cart | null>(null);
  private localCart: Cart;

  constructor(private http: HttpClient) {
    // Al iniciar, cargar carrito de localStorage
    const stored = localStorage.getItem(this.LOCAL_CART_KEY);
    this.localCart = stored ? JSON.parse(stored) as Cart : { id: '', user_id: '', items: [], applied_discounts: [] };
    this.cartChanged$.next(this.localCart);
  }

  /** Obtiene carrito en memoria (localStorage) */
  getLocalCart(): Cart {
    return this.localCart;
  }

  /** Guarda carrito en localStorage y emite cambio */
  private saveLocalCart(cart: Cart): void {
    this.localCart = cart;
    localStorage.setItem(this.LOCAL_CART_KEY, JSON.stringify(cart));
    this.cartChanged$.next(cart);
  }

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
    const cart = this.getLocalCart();
    const existing = cart.items.find(item => item.project_id === product.projectId);
    if (existing) {
      existing.quantity++;
    } else {
      const newItem = new CartItem();
      newItem.project_id = product.projectId;
      newItem.quantity = 1;
      newItem.unit_price = product.priceAmount;
      newItem.projectName = product.projectDetails?.title || product.projectTitle;
      newItem.projectImage = product.projectDetails?.previewUrl || product.projectPreviewUrl || environment.defaultPreviewImageUrl;
      cart.items.push(newItem);
    }
    this.saveLocalCart(cart);
    return of(cart);
  }

  /** Confirma el carrito al backend como una nueva orden */
  checkoutCart(userId: string): Observable<Cart> {
    return this.http.post<Cart>(`${environment.apiBaseUrl}/carts`, this.localCart).pipe(
      tap(createdCart => {
        this.saveLocalCart({ id: '', user_id: userId, items: [], applied_discounts: [] });
      })
    );
  }

  private createCartWithProduct(cart: Cart, product: Product): Observable<Cart> {
    const newItem = new CartItem();
    newItem.project_id = product.projectId;
    newItem.quantity = 1;
    newItem.unit_price = product.priceAmount;
    newItem.projectName = product.projectDetails?.title || product.projectTitle;
    newItem.projectImage = product.projectDetails?.previewUrl || product.projectPreviewUrl || environment.defaultPreviewImageUrl;
    cart.items = [newItem];
    return this.http.post<Cart>(`${environment.apiBaseUrl}/carts`, cart).pipe(
      map((createdCart) => {
        this.cartChanged$.next(createdCart);
        return createdCart;
      })
    );
  }
}
