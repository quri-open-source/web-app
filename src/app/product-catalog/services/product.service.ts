import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ProductAssembler } from './product.assembler';
import { ProductResponse } from './product.response';
import { ProjectResponse } from '../../design-lab/services/project.response';
import { ProjectService } from '../../design-lab/services/project.service';
import { Project } from '../../design-lab/model/project.entity';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../model/product.entity';
import { ProjectAssembler } from '../../design-lab/services/project.assembler';
import { environment } from '../../../environments/environment';
// ...no custom request/like response imports; use inline typings

const BASE_URL = `${environment.apiBaseUrl}/products`;

@Injectable({
  providedIn: 'root',
})
export class ProductService {
    private http = inject(HttpClient);
    private projectService = inject(ProjectService);

    /**
     * Get current user ID from localStorage (IAM system)
     */
    private getCurrentUserId(): string | null {
        return localStorage.getItem('userId');
    }

    /** Get all products or filter by project */
    getAllProducts(projectId?: string) {
      const url = projectId ? `${BASE_URL}?projectId=${projectId}` : BASE_URL;
      return this.http.get<ProductResponse[]>(url).pipe(
        map((res) => ProductAssembler.toEntitiesFromResponse(res))
      );
    }

    /** Get a single product by ID */
    getProductById(id: string) {
      return this.http.get<ProductResponse>(`${BASE_URL}/${id}`).pipe(
        map((res) => ProductAssembler.toEntityFromResponse(res))
      );
    }

    /** Create a new product */
    createProduct(payload: any) {
      return this.http.post<ProductResponse>(`${environment.apiBaseUrl}/products`, payload).pipe(
        map((res) => ProductAssembler.toEntityFromResponse(res))
      );
    }
  
    /** Update an existing product */
    updateProduct(id: string, payload: any) {
      return this.http.patch<ProductResponse>(`${environment.apiBaseUrl}/products/${id}`, payload).pipe(
        map((res) => ProductAssembler.toEntityFromResponse(res))
      );
    }
  
    /** Delete a product */
    deleteProduct(id: string) {
      return this.http.delete<void>(`${BASE_URL}/${id}`);
    }
  
    /** Likes: get total likes */
    getLikeCount(productId: string) {
      return this.http.get<{ likeCount: number }>(
        `${environment.apiBaseUrl}/products/${productId}/likes/count`
      );
    }
  
    /** Likes: check if a user liked */
    getUserLikeStatus(productId: string, userId: string) {
      return this.http.get<{ isLiked: boolean }>(
        `${environment.apiBaseUrl}/products/${productId}/likes/${userId}`
      );
    }
  
    /** Likes: like a product */
    likeProduct(productId: string, userId: string) {
      return this.http.post<{ message: string; productId: string; userId: string }>(
        `${environment.apiBaseUrl}/products/${productId}/likes/${userId}`,
        null
      );
    }
  
    /** Likes: unlike a product */
    unlikeProduct(productId: string, userId: string) {
      return this.http.delete<void>(
        `${environment.apiBaseUrl}/products/${productId}/likes/${userId}`
      );
    }
}
