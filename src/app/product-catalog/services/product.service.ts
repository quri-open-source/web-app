import { inject, Injectable } from '@angular/core';
import { map, switchMap, forkJoin } from 'rxjs';
import { UserService} from '../../user-management/services/user.service';
import { ProductAssembler } from './product.assembler';
import { ProductResponse } from './product.response';
import { BaseService } from '../../access-security/services/access.service';
import { ProjectResponse } from '../../design-lab/services/project.response';
import { ProjectService } from '../../design-lab/services/project.service';
import { Project } from '../../design-lab/model/project.entity';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../model/product.entity';
import { ProjectAssembler } from '../../design-lab/services/project.assembler';
import { environment } from '../../../environments/environment';

const GET_ALL_PRODUCTS = `${environment.apiBaseUrl}/catalog`;

const GET_PRODUCT_BY_PROJECT_ID = (id: string) =>
    `${environment.apiBaseUrl}/products?project_id=${id}`;

const GET_PRODUCT_BY_ID = (id: string) =>
    `${environment.apiBaseUrl}/products?id=${id}`;

const GET_PROJECT_BY_ID = (id: string) =>
    `${environment.apiBaseUrl}/projects?id=${id}`;

@Injectable({
  providedIn: 'root',
})
export class ProductService extends BaseService<ProductResponse> {
    protected userService = inject(UserService);

    private productsUrl = 'http://localhost:3000/catalog';
    private projectsUrl = 'http://localhost:3000/projects';

    constructor(public projectService: ProjectService, override http: HttpClient) {
        super('products');
      }

    getAllProducts() {
        return this.http
        .get<ProductResponse[]>(GET_ALL_PRODUCTS)
        .pipe(
            map((products) =>
            ProductAssembler.toEntitiesFromResponse(products)
            )
        );
    }

    getUserProducts() {
        const userId = this.userService.getSessionUserId();

        return this.http
            .get<ProjectResponse[]>(`http://localhost:3000/projects?user_id=${userId}`)
            .pipe(
                switchMap((projects) => {
                    const projectIds = projects.map((project) => project.id);

                    const queryParam = projectIds.map(GET_PRODUCT_BY_PROJECT_ID).join('&');
                    return this.http.get<ProductResponse[]>(queryParam);
                }),
                map((products) => ProductAssembler.toEntitiesFromResponse(products))
            );
    }

    getProjectNameByProduct(productId: string) {
        return this.http.get<ProductResponse[]>(GET_PRODUCT_BY_ID(productId)).pipe(
          map((products) => products[0]),
          switchMap((product) =>
            this.projectService.getAllPublicProjectsForDevUser().pipe(
              map((projects: Project[]) => {
                const found = projects.find((p: Project) => p.id === product.project_id);
                return found ? found.title : '';
              })
            )
          )
        );
      }

      getAllProductsWithProjects(): Observable<Product[]> {
        return forkJoin({
            products: this.http.get<ProductResponse[]>(this.productsUrl),
            projectResponses: this.http.get<ProjectResponse[]>(this.projectsUrl),
        }).pipe(
            map(({ products, projectResponses }) => {
                const projects = ProjectAssembler.toEntitiesFromResponse(projectResponses);
                return products.map((product) => {
                    const project = projects.find((p) => p.id === product.project_id);
                    return {
                        id: product.id,
                        projectId: product.project_id,
                        manufacturerId: product.manufacturer_id,
                        price: product.price,
                        likes: product.likes,
                        tags: product.tags,
                        createdAt: new Date(product.created_at),
                        gallery: product.gallery,
                        rating: product.rating,
                        status: product.status,
                        comments: product.comments.map((comment) => ({
                            id: comment.id,
                            userId: comment.user_id,
                            text: comment.content,
                            createdAt: new Date(comment.created_at),
                        })),
                        projectDetails: project ? {
                            id: project.id,
                            title: project.title,
                            userId: project.userId,
                            previewUrl: project.previewUrl,
                            status: project.status,
                            garmentColor: project.garmentColor,
                            garmentSize: project.garmentSize,
                            garmentGender: project.garmentGender,
                            layers: project.layers,
                            createdAt: project.createdAt,
                            updatedAt: project.updatedAt
                        } : undefined,
                    };
                });
            })
        );
    }
}
