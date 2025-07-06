import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../../iam/services/authentication.service';
import { Project } from '../model/project.entity';
import { TextLayer, ImageLayer, Layer } from '../model/layer.entity';
import { LayerType } from '../../const';
import {
  CreateProjectRequest,
  CreateTextLayerRequest,
  CreateImageLayerRequest,
  UpdateTextLayerRequest,
  UpdateImageLayerRequest,
  UpdateLayerCoordinatesRequest
} from './design-lab.requests';
import {
  ProjectResponse,
  CreateProjectResponse,
  DeleteProjectResponse,
  LayerOperationResponse,
  LayerResponse,
  ProjectResult,
  LayerResult,
  DeleteProjectResult
} from './design-lab.responses';

const BASE_URL = `${environment.serverBaseUrl}/api/v1/projects`;

@Injectable({
  providedIn: 'root',
})
export class DesignLabService {
  private http = inject(HttpClient);
  private authService = inject(AuthenticationService);

  constructor() {
  }

  // ==================== PROJECT METHODS ====================

  /**
   * Obtener todos los proyectos de un usuario
   */
  getProjectsByUser(userId: string): Observable<Project[]> {

    const params = new HttpParams().set('userId', userId);

    return this.http.get<ProjectResponse[]>(BASE_URL, {
      headers: this.getHeaders(),
      params: params
    }).pipe(
      map(responses => {
        return responses.map(response => this.mapToProject(response));
      }),
      catchError(error => {
        console.error('❌ Error fetching projects:', error);
        return throwError(() => this.getErrorMessage(error));
      })
    );
  }

  /**
   * Obtener proyecto por ID
   */
  getProjectById(projectId: string): Observable<Project> {

    return this.http.get<ProjectResponse>(`${BASE_URL}/${projectId}`, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        return this.mapToProject(response);
      }),
      catchError(error => {
        return throwError(() => this.getErrorMessage(error));
      })
    );
  }

  /**
   * Crear un nuevo proyecto
   */
  createProject(request: CreateProjectRequest): Observable<ProjectResult> {

    return this.http.post<CreateProjectResponse>(BASE_URL, request, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        return {
          success: response.success,
          projectId: response.projectId,
          error: response.error
        };
      }),
      catchError(error => {
        return throwError(() => this.getErrorMessage(error));
      })
    );
  }

  /**
   * Eliminar un proyecto
   */
  deleteProject(projectId: string): Observable<DeleteProjectResult> {

    const url = `${BASE_URL}/${projectId}`;

    return this.http.delete<DeleteProjectResponse>(url, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        return {
          success: response.success,
          error: response.error
        };
      }),
      catchError(error => {
        return throwError(() => this.getErrorMessage(error));
      })
    );
  }

  /**
   * Actualizar los detalles de un proyecto (incluyendo preview URL)
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
   * Actualizar solo el preview URL de un proyecto
   * Este método es un wrapper que actualiza el previewUrl manteniendo los demás campos
   */
  updateProjectPreview(projectId: string, previewUrl: string, currentProject?: Project): Observable<ProjectResult> {

    // Si tenemos el proyecto actual, incluimos todos sus campos para no perder datos
    const updateData: any = { previewUrl };

    if (currentProject) {
      updateData.status = currentProject.status;
      updateData.garmentColor = currentProject.garmentColor;
      updateData.garmentSize = currentProject.garmentSize;
      updateData.garmentGender = currentProject.garmentGender;

    }

    return this.updateProjectDetails(projectId, updateData);
  }

  /**
   * Actualizar el status de un proyecto a GARMENT
   */
  updateProjectStatus(projectId: string, status: string, currentProject?: Project): Observable<ProjectResult> {

    // Construir el body con todos los campos para no perder datos
    const updateData: any = { status };

    if (currentProject) {
      updateData.previewUrl = currentProject.previewUrl;
      updateData.garmentColor = currentProject.garmentColor;
      updateData.garmentSize = currentProject.garmentSize;
      updateData.garmentGender = currentProject.garmentGender;

    }

    return this.updateProjectDetails(projectId, updateData);
  }

  // ==================== LAYER METHODS ====================

  /**
   * Crear una nueva capa de texto
   */
  createTextLayer(request: CreateTextLayerRequest): Observable<LayerResult> {

    const url = `${BASE_URL}/layers/texts`;


    return this.http.post<LayerOperationResponse>(url, request, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        return {
          success: response.success,
          layerId: response.layerId,
          error: response.error
        };
      }),
      catchError(error => {
        return throwError(() => this.getErrorMessage(error));
      })
    );
  }

  /**
   * Crear una nueva capa de imagen
   */
  createImageLayer(request: CreateImageLayerRequest): Observable<LayerResult> {

    const url = `${BASE_URL}/${request.projectId}/layers/image`;

    return this.http.post<LayerOperationResponse>(url, request, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        return {
          success: response.success,
          layerId: response.layerId,
          error: response.error
        };
      }),
      catchError(error => {
        return throwError(() => this.getErrorMessage(error));
      })
    );
  }

  /**
   * Actualizar una capa de texto
   */
  updateTextLayer(projectId: string, layerId: string, request: UpdateTextLayerRequest): Observable<LayerResult> {

    const url = `${BASE_URL}/${projectId}/layers/${layerId}/text`;

    return this.http.put<LayerOperationResponse>(url, request, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        return {
          success: response.success,
          layerId: response.layerId,
          error: response.error
        };
      }),
      catchError(error => {
        return throwError(() => this.getErrorMessage(error));
      })
    );
  }

  /**
   * Actualizar una capa de imagen
   */
  updateImageLayer(projectId: string, layerId: string, request: UpdateImageLayerRequest): Observable<LayerResult> {

    const url = `${BASE_URL}/${projectId}/layers/${layerId}/image`;

    return this.http.put<LayerOperationResponse>(url, request, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        return {
          success: response.success,
          layerId: response.layerId,
          error: response.error
        };
      }),
      catchError(error => {
        return throwError(() => this.getErrorMessage(error));
      })
    );
  }

  /**
   * Actualizar coordenadas de una capa
   */
  updateLayerCoordinates(projectId: string, layerId: string, request: UpdateLayerCoordinatesRequest): Observable<LayerResult> {

    const url = `${BASE_URL}/${projectId}/layers/${layerId}/coordinates`;

    return this.http.put<LayerOperationResponse>(url, request, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        return {
          success: response.success,
          layerId: response.layerId,
          error: response.error
        };
      }),
      catchError(error => {
        return throwError(() => this.getErrorMessage(error));
      })
    );
  }

  /**
   * Eliminar una capa
   */
  deleteLayer(projectId: string, layerId: string): Observable<LayerResult> {

    const url = `${BASE_URL}/${projectId}/layers/${layerId}`;

    return this.http.delete<LayerOperationResponse>(url, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        return {
          success: response.success,
          layerId: response.layerId,
          error: response.error
        };
      }),
      catchError(error => {
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
        return throwError(() => this.getErrorMessage(error));
      })
    );
  }

  // ==================== PRIVATE METHODS ====================

  /**
   * Obtener headers HTTP con autenticación
   */
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return headers;
  }

  /**
   * Mapear ProjectResponse a Project entity
   */
  private mapToProject(response: ProjectResponse): Project {
    return new Project(
      response.id,
      response.title,
      response.userId,
      response.previewUrl,
      response.status,
      response.garmentColor,
      response.garmentSize,
      response.garmentGender,
      response.layers?.map(layer => this.mapToLayer(layer)) || [],
      new Date(response.createdAt),
      new Date(response.updatedAt)
    );
  }

  /**
   * Mapear LayerResponse a Layer entity
   */
  private mapToLayer(response: LayerResponse): Layer {
    if (response.type === LayerType.TEXT) {
      return new TextLayer(
        response.id,
        response.x,
        response.y,
        response.z,
        response.opacity,
        response.isVisible,
        new Date(response.createdAt),
        new Date(response.updatedAt),
        response.details || {
          text: '',
          fontFamily: 'Arial',
          fontSize: 16,
          fontColor: '#000000',
          isBold: false,
          isItalic: false,
          isUnderlined: false
        }
      );
    }

    if (response.type === LayerType.IMAGE) {
      return new ImageLayer(
        response.id,
        response.x,
        response.y,
        response.z,
        response.opacity,
        response.isVisible,
        response.details?.imageUrl || ''
      );
    }

    // Fallback para tipos no reconocidos
    return new TextLayer(
      response.id,
      response.x,
      response.y,
      response.z,
      response.opacity,
      response.isVisible,
      new Date(response.createdAt),
      new Date(response.updatedAt),
      { text: '', fontFamily: 'Arial', fontSize: 16, fontColor: '#000000', isBold: false, isItalic: false, isUnderlined: false }
    );
  }

  /**
   * Obtener mensaje de error legible
   */
  private getErrorMessage(error: any): string {
    if (error.status === 401) {
      return 'Token expirado o inválido. Por favor, inicia sesión nuevamente.';
    } else if (error.status === 403) {
      return 'No tienes permisos para realizar esta acción.';
    } else if (error.status === 404) {
      return 'Recurso no encontrado.';
    } else if (error.status === 500) {
      return 'Error interno del servidor. Intenta nuevamente más tarde.';
    } else if (error.error?.message) {
      return error.error.message;
    } else {
      return 'Error desconocido. Intenta nuevamente.';
    }
  }
}
