import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, throwError, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../../iam/services/authentication.service';
import { Project } from '../model/project.entity';
import { DesignLabAssembler } from './design-lab.assemblers';
import { CloudinaryService, ImageUploadWithDimensions } from './cloudinary.service';

// Imports from project.response.ts - todos los endpoints reales
import {
  CreateProjectRequest,
  CreateProjectResponse,
  CreateTextLayerRequest,
  CreateTextLayerResponse,
  CreateImageLayerResponse,
  DeleteLayerResponse,
  DeleteProjectResponse,
  UpdateLayerCoordinatesResponse,
  UpdateTextLayerDetailsResponse,
  UpdateImageLayerDetailsRequest,
  UpdateImageLayerDetailsResponse,
  GetAllUserProjectsResponse
} from './project.response';

const BASE_URL = `${environment.serverBaseUrl}/api/v1/projects`;

export interface LayerResult {
  success: boolean;
  layerId?: string;
  error?: string;
}

export interface ProjectResult {
  success: boolean;
  projectId?: string;
  error?: string;
}

export interface DeleteResult {
  success: boolean;
  error?: string;
}

@Injectable({
  providedIn: 'root',
})
export class DesignLabService {
  private http = inject(HttpClient);
  private authService = inject(AuthenticationService);
  private assembler = inject(DesignLabAssembler);
  private cloudinaryService = inject(CloudinaryService);

  constructor() {
  }

  /**
   * Obtener token de autenticación de forma segura
   */
  private getAuthToken(): string {

    // Intentar obtener el token del AuthenticationService
    let token = this.authService.getToken();

    // Si no hay token, forzar verificación de localStorage
    if (!token) {
      token = localStorage.getItem('token');

      // Si encontramos token en localStorage, forzar restauración en AuthService
      if (token) {
        this.authService.checkStoredAuthentication();
      }
    }

    // Validar que el token existe
    if (!token) {
      return '';
    }

    return token;
  }

  /**
   * Asegurar que la autenticación esté disponible
   */
  private ensureAuthentication(): void {

    // Verificar localStorage directamente
    const tokenInStorage = localStorage.getItem('token');
    const userIdInStorage = localStorage.getItem('userId');
    const usernameInStorage = localStorage.getItem('username');


    if (tokenInStorage && userIdInStorage && usernameInStorage) {
      this.authService.checkStoredAuthentication();
    }
  }

  // ==================== PROJECT METHODS ====================

  /**
   * Obtener todos los proyectos de un usuario
   * GET http://localhost:8080/api/v1/projects?userId=cd9b8fcb-b943-40cf-aa90-a5cd1812f602
   */
  getProjectsByUser(userId: string): Observable<Project[]> {

    // SIEMPRE asegurar autenticación antes de hacer petición
    this.ensureAuthentication();

    // Debug del estado completo de autenticación
    this.debugAuthenticationState();

    const params = new HttpParams().set('userId', userId);


    return this.http.get<GetAllUserProjectsResponse>(BASE_URL, {
      headers: this.getHeaders(),
      params: params
    }).pipe(
      map(responses => {
        return this.assembler.toProjectEntities(responses);
      }),
      catchError(error => {
        // Debug adicional en caso de error
        this.debugAuthenticationState();
        return throwError(() => this.getErrorMessage(error));
      })
    );
  }

  /**
   * Obtener todos los proyectos de un usuario con retry en caso de problemas de autenticación
   * GET http://localhost:8080/api/v1/projects?userId=cd9b8fcb-b943-40cf-aa90-a5cd1812f602
   */
  getProjectsByUserWithRetry(userId: string): Observable<Project[]> {
    return new Observable(observer => {
      // Primero intentar inmediatamente
      this.getProjectsByUser(userId).subscribe({
        next: (projects) => {
          observer.next(projects);
          observer.complete();
        },
        error: (error) => {
          // Si es error 401, esperar un poco y reintentar una vez
          if (error.includes('Token expirado') || error.includes('401')) {

            setTimeout(() => {
              // Forzar verificación de autenticación
              this.authService.checkStoredAuthentication();

              // Reintentar
              this.getProjectsByUser(userId).subscribe({
                next: (projects) => {
                  observer.next(projects);
                  observer.complete();
                },
                error: (retryError) => {
                  observer.error(retryError);
                }
              });
            }, 1000); // Esperar 1 segundo
          } else {
            observer.error(error);
          }
        }
      });
    });
  }

  /**
   * Obtener proyecto por ID
   * GET http://localhost:8080/api/v1/projects/{id}
   */
  getProjectById(projectId: string): Observable<Project> {

    return this.http.get<any>(`${BASE_URL}/${projectId}`, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        return this.assembler.toProjectEntity(response);
      }),
      catchError(error => {
        return throwError(() => this.getErrorMessage(error));
      })
    );
  }

  /**
   * Crear un nuevo proyecto
   * POST http://localhost:8080/api/v1/projects
   */
  createProject(request: CreateProjectRequest): Observable<ProjectResult> {

    return this.http.post<CreateProjectResponse>(BASE_URL, request, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        return this.assembler.toCreateProjectResult(response);
      }),
      catchError(error => {
        console.error('❌ Error creating project:', error);
        return throwError(() => this.getErrorMessage(error));
      })
    );
  }

  /**
   * Eliminar un proyecto
   * DELETE http://localhost:8080/api/v1/projects/{projectId}
   */
  deleteProject(projectId: string): Observable<DeleteResult> {

    const url = `${BASE_URL}/${projectId}`;

    return this.http.delete<DeleteProjectResponse>(url, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        return this.assembler.toDeleteProjectResult(response);
      }),
      catchError(error => {
        return throwError(() => this.getErrorMessage(error));
      })
    );
  }

  /**
   * Actualizar el preview URL de un proyecto
   * PUT http://localhost:8080/api/v1/projects/{projectId}/details
   */
  updateProjectPreview(projectId: string, previewUrl: string, currentProject?: Project): Observable<ProjectResult> {

    const url = `${BASE_URL}/${projectId}/details`;

    // Construir el body con todos los campos para no perder datos
    const requestBody: any = { previewUrl };

    if (currentProject) {
      requestBody.status = currentProject.status;
      requestBody.garmentColor = currentProject.garmentColor;
      requestBody.garmentSize = currentProject.garmentSize;
      requestBody.garmentGender = currentProject.garmentGender;
    }


    return this.http.put<{ message: string; timestamp: string }>(url, requestBody, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        return {
          success: true,
          projectId: projectId,
          error: undefined
        };
      }),
      catchError(error => {
        return throwError(() => this.getErrorMessage(error));
      })
    );
  }

  /**
   * Actualizar los detalles de un proyecto (incluyendo preview URL y status)
   * PUT http://localhost:8080/api/v1/projects/{projectId}/details
   */
  updateProjectDetails(projectId: string, details: {
    previewUrl?: string;
    status?: string;
    garmentColor?: string;
    garmentSize?: string;
    garmentGender?: string;
  }): Observable<ProjectResult> {

    const url = `${BASE_URL}/${projectId}/details`;

    return this.http.put<{ message: string; timestamp: string }>(url, details, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        return {
          success: true,
          projectId: projectId,
          error: undefined
        };
      }),
      catchError(error => {
        return throwError(() => this.getErrorMessage(error));
      })
    );
  }

  /**
   * Actualizar el status de un proyecto a GARMENT
   * PUT http://localhost:8080/api/v1/projects/{projectId}/details
   */
  updateProjectStatus(projectId: string, status: string, currentProject?: Project): Observable<ProjectResult> {

    const url = `${BASE_URL}/${projectId}/details`;

    // Construir el body con todos los campos para no perder datos
    const requestBody: any = { status };

    if (currentProject) {
      requestBody.previewUrl = currentProject.previewUrl;
      requestBody.garmentColor = currentProject.garmentColor;
      requestBody.garmentSize = currentProject.garmentSize;
      requestBody.garmentGender = currentProject.garmentGender;
    }

    return this.http.put<{ message: string; timestamp: string }>(url, requestBody, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        return {
          success: true,
          projectId: projectId,
          error: undefined
        };
      }),
      catchError(error => {
        return throwError(() => this.getErrorMessage(error));
      })
    );
  }

  // ==================== TEXT LAYER METHODS ====================

  /**
   * Crear una nueva capa de texto
   * POST http://localhost:8080/api/v1/projects/layers/texts
   */
  createTextLayer(projectId: string, request: {
    text: string;
    fontColor: string;
    fontFamily: string;
    fontSize: number;
    isBold: boolean;
    isItalic: boolean;
    isUnderlined: boolean;
  }): Observable<LayerResult> {

    const fullRequest: CreateTextLayerRequest = {
      projectId: projectId,
      ...request
    };

    const url = `${BASE_URL}/layers/texts`;

    return this.http.post<CreateTextLayerResponse>(url, fullRequest, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        return this.assembler.toCreateTextLayerResult(response);
      }),
      catchError(error => {
        return throwError(() => this.getErrorMessage(error));
      })
    );
  }

  /**
   * Actualizar detalles de una capa de texto
   * PUT http://localhost:8080/api/v1/projects/{projectId}/layers/{layerId}/text-details
   */
  updateTextLayerDetails(projectId: string, layerId: string, request: {
    text: string;
    fontColor: string;
    fontFamily: string;
    fontSize: number;
    isBold: boolean;
    isItalic: boolean;
    isUnderlined: boolean;
  }): Observable<LayerResult> {

    const url = `${BASE_URL}/${projectId}/layers/${layerId}/text-details`;
    const requestBody = this.assembler.toUpdateTextLayerDetailsRequest(request);

    return this.http.put<UpdateTextLayerDetailsResponse>(url, requestBody, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        return this.assembler.toUpdateTextLayerResult(response);
      }),
      catchError(error => {
        return throwError(() => this.getErrorMessage(error));
      })
    );
  }

  // ==================== IMAGE LAYER METHODS ====================

  /**
   * Crear una nueva capa de imagen
   * POST http://localhost:8080/api/v1/projects/{projectId}/images
   */
  createImageLayer(projectId: string, request: {
    imageUrl: string;
    width: string;
    height: string;
  }): Observable<LayerResult> {

    const url = `${BASE_URL}/${projectId}/images`;
    const requestBody = this.assembler.toCreateImageLayerRequest(request);

    return this.http.post<CreateImageLayerResponse>(url, requestBody, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        return this.assembler.toCreateImageLayerResult(response);
      }),
      catchError(error => {
        return throwError(() => this.getErrorMessage(error));
      })
    );
  }

  /**
   * Sube una imagen a Cloudinary y crea automáticamente un layer de imagen
   * @param file El archivo de imagen a subir
   * @param projectId El ID del proyecto donde crear el layer
   * @returns Observable con el resultado de la creación del layer
   */
  uploadImageAndCreateLayer(file: File, projectId: string): Observable<LayerResult> {

    return this.cloudinaryService.uploadImageWithDimensions(file).pipe(
      switchMap((result: ImageUploadWithDimensions) => {

        // Usar las dimensiones calculadas para crear el layer
        const createLayerRequest = {
          imageUrl: result.cloudinaryResult.secure_url,
          width: result.calculatedDimensions.width.toString(),
          height: result.calculatedDimensions.height.toString()
        };

        return this.createImageLayer(projectId, createLayerRequest);
      }),
      catchError(error => {
        return throwError(() => this.getErrorMessage(error));
      })
    );
  }

  /**
   * Actualizar detalles de una capa de imagen (width, height, imageUrl)
   * PUT http://localhost:8080/api/v1/projects/{projectId}/layers/{layerId}/image-details
   */
  updateImageLayerDetails(projectId: string, layerId: string, request: {
    imageUrl: string;
    width: number;
    height: number;
  }): Observable<LayerResult> {

    const url = `${BASE_URL}/${projectId}/layers/${layerId}/image-details`;
    const requestBody = this.assembler.toUpdateImageLayerDetailsRequest(request);

    return this.http.put<UpdateImageLayerDetailsResponse>(url, requestBody, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        return this.assembler.toUpdateImageLayerResult(response);
      }),
      catchError(error => {
        console.error('❌ Error updating image layer details:', error);
        return throwError(() => this.getErrorMessage(error));
      })
    );
  }

  // ==================== LAYER COORDINATION METHODS ====================

  /**
   * Actualizar coordenadas de una capa
   * PUT http://localhost:8080/api/v1/projects/{projectId}/layers/{layerId}/coordinates
   */
  updateLayerCoordinates(projectId: string, layerId: string, request: {
    x: number;
    y: number;
    z: number;
  }): Observable<LayerResult> {

    const url = `${BASE_URL}/${projectId}/layers/${layerId}/coordinates`;
    const requestBody = this.assembler.toUpdateLayerCoordinatesRequest(request);

    return this.http.put<UpdateLayerCoordinatesResponse>(url, requestBody, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        return this.assembler.toUpdateLayerCoordinatesResult(response);
      }),
      catchError(error => {
        console.error('❌ Error updating layer coordinates:', error);
        return throwError(() => this.getErrorMessage(error));
      })
    );
  }

  /**
   * Eliminar una capa
   * DELETE http://localhost:8080/api/v1/projects/{projectId}/layers/{layerId}
   */
  deleteLayer(projectId: string, layerId: string): Observable<DeleteResult> {

    const url = `${BASE_URL}/${projectId}/layers/${layerId}`;

    return this.http.delete<DeleteLayerResponse>(url, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        return this.assembler.toDeleteLayerResult(response);
      }),
      catchError(error => {
        console.error('❌ Error deleting layer:', error);
        return throwError(() => this.getErrorMessage(error));
      })
    );
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Método de prueba para verificar la autenticación
   */
  testAuthentication(): Observable<any> {

    return this.http.get<any>(BASE_URL, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        return response;
      }),
      catchError(error => {
        console.error('❌ Authentication test failed:', error);
        return throwError(() => this.getErrorMessage(error));
      })
    );
  }

  /**
   * Debug del estado de autenticación
   */
  debugAuthenticationState(): void {
  }

  // ==================== PRIVATE METHODS ====================

  /**
   * Obtener headers HTTP con autenticación
   * SIEMPRE incluye Bearer token
   */
  private getHeaders(): HttpHeaders {

    // Obtener token de forma robusta
    const token = this.getAuthToken();

    // Crear headers con Bearer token SIEMPRE
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return headers;
  }

  /**
   * Obtener mensaje de error legible
   */
  private getErrorMessage(error: any): string {

    if (error.status === 401) {

      // Intentar refrescar la autenticación
      this.authService.checkStoredAuthentication();

      return 'Token expirado o inválido. Por favor, inicia sesión nuevamente.';
    } else if (error.status === 403) {
      return 'No tienes permisos para realizar esta acción.';
    } else if (error.status === 404) {
      return 'Recurso no encontrado.';
    } else if (error.status === 500) {
      return 'Error interno del servidor. Intenta nuevamente más tarde.';
    } else if (error.status === 0) {
      return 'Error de conexión. Verifica tu conexión a internet.';
    } else if (error.error?.message) {
      return error.error.message;
    } else {
      return 'Error desconocido. Intenta nuevamente.';
    }
  }

  /**
   * Verificar si el usuario está autenticado
   */
  private isAuthenticated(): boolean {
    return this.authService.hasValidToken();
  }
}
