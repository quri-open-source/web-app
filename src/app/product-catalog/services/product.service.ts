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

    /** Get all products with their project details */
    getAllProductsWithProjects(): Observable<Product[]> {
      return this.getAllProducts().pipe(
        map(products => {
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
        })
      );
    }
}
