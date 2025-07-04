import { inject, Injectable } from '@angular/core';
import { map, catchError, throwError } from 'rxjs';
import { ProductAssembler } from './product.assembler';
import { ProductResponse } from './product.response';
import { ProjectService } from '../../design-lab/services/project.service';
import { Project } from '../../design-lab/model/project.entity';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../model/product.entity';
import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../../iam/services/authentication.service';
// ...no custom request/like response imports; use inline typings

const BASE_URL = `${environment.apiBaseUrl}/products`;

@Injectable({
  providedIn: 'root',
})
export class ProductService {
    private http = inject(HttpClient);
    private projectService = inject(ProjectService);
    private authService = inject(AuthenticationService);

    /**
     * Get current user ID from localStorage (IAM system)
     */
    private getCurrentUserId(): string | null {
        return localStorage.getItem('userId');
    }

    /**
     * Get authentication headers with bearer token
     */
    private getAuthHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        let headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        if (token) {
            headers = headers.set('Authorization', `Bearer ${token}`);
        }

        return headers;
    }

    /**
     * Handle HTTP errors with authentication context
     */
    private handleError = (error: HttpErrorResponse) => {
        console.error('❌ ProductService HTTP Error:', error);

        if (error.status === 401) {
            // Unauthorized - token might be expired
            console.warn('🔓 Unauthorized access detected, clearing session');
            this.authService.signOut();
        } else if (error.status === 403) {
            console.warn('🚫 Forbidden access - insufficient permissions');
        }

        return throwError(() => error);
    };

    /** Get all products or filter by project */
    getAllProducts(projectId?: string): Observable<Product[]> {
      const url = projectId ? `${BASE_URL}?projectId=${projectId}` : BASE_URL;

      console.log('🔍 ProductService - Getting all products from:', url);
      console.log('🔑 ProductService - Using authentication headers');

      return this.http.get<ProductResponse[]>(url, { headers: this.getAuthHeaders() }).pipe(
        map((res) => {
          console.log('✅ ProductService - Products fetched successfully:', res.length);
          return ProductAssembler.toEntitiesFromResponse(res);
        }),
        catchError(this.handleError)
      );
    }

    /** Get a single product by ID */
    getProductById(id: string): Observable<Product> {
      console.log('🔍 ProductService - Getting product by ID:', id);

      return this.http.get<ProductResponse>(`${BASE_URL}/${id}`, { headers: this.getAuthHeaders() }).pipe(
        map((res) => {
          console.log('✅ ProductService - Product fetched successfully:', res.id);
          return ProductAssembler.toEntityFromResponse(res);
        }),
        catchError(this.handleError)
      );
    }

    /** Create a new product */
    createProduct(payload: any): Observable<Product> {
      console.log('🆕 ProductService - Creating new product');

      return this.http.post<ProductResponse>(`${environment.apiBaseUrl}/products`, payload, { headers: this.getAuthHeaders() }).pipe(
        map((res) => {
          console.log('✅ ProductService - Product created successfully:', res.id);
          return ProductAssembler.toEntityFromResponse(res);
        }),
        catchError(this.handleError)
      );
    }

    /** Update an existing product */
    updateProduct(id: string, payload: any): Observable<Product> {
      console.log('📝 ProductService - Updating product:', id);

      return this.http.patch<ProductResponse>(`${environment.apiBaseUrl}/products/${id}`, payload, { headers: this.getAuthHeaders() }).pipe(
        map((res) => {
          console.log('✅ ProductService - Product updated successfully:', res.id);
          return ProductAssembler.toEntityFromResponse(res);
        }),
        catchError(this.handleError)
      );
    }

    /** Delete a product */
    deleteProduct(id: string): Observable<void> {
      console.log('🗑️ ProductService - Deleting product:', id);

      return this.http.delete<void>(`${BASE_URL}/${id}`, { headers: this.getAuthHeaders() }).pipe(
        map(() => {
          console.log('✅ ProductService - Product deleted successfully:', id);
        }),
        catchError(this.handleError)
      );
    }

    /** Likes: get total likes */
    getLikeCount(productId: string): Observable<{ likeCount: number }> {
      console.log('📊 ProductService - Getting like count for product:', productId);

      return this.http.get<{ likeCount: number }>(
        `${environment.apiBaseUrl}/products/${productId}/likes/count`,
        { headers: this.getAuthHeaders() }
      ).pipe(
        map((res) => {
          console.log('✅ ProductService - Like count retrieved:', res.likeCount);
          return res;
        }),
        catchError(this.handleError)
      );
    }

    /** Likes: check if a user liked */
    getUserLikeStatus(productId: string, userId: string): Observable<{ isLiked: boolean }> {
      console.log('🔍 ProductService - Checking like status for user:', userId, 'product:', productId);

      return this.http.get<{ isLiked: boolean }>(
        `${environment.apiBaseUrl}/products/${productId}/likes/${userId}`,
        { headers: this.getAuthHeaders() }
      ).pipe(
        map((res) => {
          console.log('✅ ProductService - Like status retrieved:', res.isLiked);
          return res;
        }),
        catchError(this.handleError)
      );
    }

    /** Likes: like a product */
    likeProduct(productId: string, userId: string): Observable<{ message: string; productId: string; userId: string }> {
      console.log('👍 ProductService - Liking product:', productId, 'for user:', userId);

      return this.http.post<{ message: string; productId: string; userId: string }>(
        `${environment.apiBaseUrl}/products/${productId}/likes/${userId}`,
        null,
        { headers: this.getAuthHeaders() }
      ).pipe(
        map((res) => {
          console.log('✅ ProductService - Product liked successfully:', res.message);
          return res;
        }),
        catchError(this.handleError)
      );
    }

    /** Likes: unlike a product */
    unlikeProduct(productId: string, userId: string): Observable<void> {
      console.log('👎 ProductService - Unliking product:', productId, 'for user:', userId);

      return this.http.delete<void>(
        `${environment.apiBaseUrl}/products/${productId}/likes/${userId}`,
        { headers: this.getAuthHeaders() }
      ).pipe(
        map(() => {
          console.log('✅ ProductService - Product unliked successfully');
        }),
        catchError(this.handleError)
      );
    }

    /** Get all products with their project details */
    getAllProductsWithProjects(): Observable<Product[]> {
      console.log('🔍 ProductService - Getting all products with project details');

      return this.getAllProducts().pipe(
        map(products => {
          console.log('🔄 ProductService - Processing products with project details:', products.length);

          // For each product, fetch its project details and create a new Product with projectDetails
          return products.map(product => {
            // Create a mock project details based on the product's project properties
            const mockProject = new Project(
              product.projectId,
              product.projectTitle,
              product.projectUserId,
              product.projectPreviewUrl,
              'PUBLISHED' as any, // Mock status
              'BLACK' as any, // Mock color
              'M' as any, // Mock size
              'UNISEX' as any, // Mock gender
              [], // Mock layers
              product.createdAt,
              product.updatedAt
            );

            return new Product(
              product.id,
              product.projectId,
              product.priceAmount,
              product.priceCurrency,
              product.status,
              product.projectTitle,
              product.projectPreviewUrl,
              product.projectUserId,
              product.likeCount,
              product.createdAt,
              product.updatedAt,
              Math.floor(Math.random() * 5) + 1, // Mock rating 1-5
              product.projectPreviewUrl ? [product.projectPreviewUrl] : [], // Mock gallery
              ['design', 'custom'], // Mock tags
              mockProject // Include project details
            );
          });
        }),
        catchError(this.handleError)
      );
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
      const token = localStorage.getItem('token');
      const userId = this.getCurrentUserId();
      return !!(token && userId);
    }

    /**
     * Get authenticated user's products
     */
    getUserProducts(): Observable<Product[]> {
      const userId = this.getCurrentUserId();

      if (!userId) {
        console.error('❌ ProductService - No authenticated user found');
        return throwError(() => new Error('User not authenticated'));
      }

      console.log('🔍 ProductService - Getting products for user:', userId);

      return this.http.get<ProductResponse[]>(`${BASE_URL}?userId=${userId}`, { headers: this.getAuthHeaders() }).pipe(
        map((res) => {
          console.log('✅ ProductService - User products fetched successfully:', res.length);
          return ProductAssembler.toEntitiesFromResponse(res);
        }),
        catchError(this.handleError)
      );
    }

    /**
     * Get user's liked products
     */
    getUserLikedProducts(): Observable<Product[]> {
      const userId = this.getCurrentUserId();

      if (!userId) {
        console.error('❌ ProductService - No authenticated user found');
        return throwError(() => new Error('User not authenticated'));
      }

      console.log('❤️ ProductService - Getting liked products for user:', userId);

      return this.http.get<ProductResponse[]>(`${BASE_URL}/liked/${userId}`, { headers: this.getAuthHeaders() }).pipe(
        map((res) => {
          console.log('✅ ProductService - Liked products fetched successfully:', res.length);
          return ProductAssembler.toEntitiesFromResponse(res);
        }),
        catchError(this.handleError)
      );
    }
}
