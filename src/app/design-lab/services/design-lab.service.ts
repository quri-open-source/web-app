import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../../iam/services/authentication.service';

// Import Request DTOs
import {
    CreateProjectRequest,
    UpdateProjectDetailsRequest,
    UpdateProjectRequest,
    CreateTextLayerRequest,
    CreateImageLayerRequest,
    UpdateTextLayerDetailsRequest,
    UpdateImageLayerDetailsRequest,
    UpdateLayerCoordinatesRequest
} from './project.request';

// Import Response DTOs
import {
    ProjectResponse,
    ProjectDetailsResponse,
    LayerResponse,
    TextLayerResponse,
    ImageLayerResponse,
    DeleteLayerResponse,
    DeleteProjectResponse
} from './design-lab.response';

const BASE_URL = `${environment.apiBaseUrl}/projects`;

@Injectable({
    providedIn: 'root',
})
export class DesignLabService {
    private http = inject(HttpClient);
    private authService = inject(AuthenticationService);

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
        console.error('❌ DesignLabService HTTP Error:', {
            status: error.status,
            statusText: error.statusText,
            message: error.message,
            url: error.url,
            error: error.error
        });

        // Handle authentication errors
        if (error.status === 401) {
            console.warn('🔓 Unauthorized access detected, clearing session');
            this.authService.signOut();
            return throwError(() => new Error('Authentication required. Please sign in again.'));
        }

        // Handle authorization errors
        if (error.status === 403) {
            console.warn('🚫 Forbidden access - insufficient permissions');
            return throwError(() => new Error('You do not have permission to perform this action.'));
        }

        // Handle not found errors
        if (error.status === 404) {
            console.warn('🔍 Resource not found');
            return throwError(() => new Error('The requested resource was not found.'));
        }

        // Handle validation errors
        if (error.status === 400) {
            console.warn('⚠️ Bad request - validation error');
            return throwError(() => new Error(error.error?.message || 'Invalid request data.'));
        }

        // Handle server errors
        if (error.status >= 500) {
            console.error('🔥 Server error occurred');
            return throwError(() => new Error('A server error occurred. Please try again later.'));
        }

        // Default error handling
        return throwError(() => new Error(error.error?.message || 'An unexpected error occurred.'));
    };

    // ==================== PROJECT ENDPOINTS ====================

    /**
     * Get all projects by user ID
     * GET /api/v1/projects?userId={userId}
     */
    getAllProjectsByUserId(userId: string): Observable<ProjectResponse[]> {
        console.log('🔍 DesignLabService - Getting projects for user:', userId);

        return this.http.get<ProjectResponse[]>(`${BASE_URL}?userId=${userId}`, {
            headers: this.getAuthHeaders()
        }).pipe(
            map((response) => {
                console.log('✅ DesignLabService - Projects fetched successfully:', response.length);
                return response;
            }),
            catchError(this.handleError)
        );
    }

    /**
     * Get project by ID
     * GET /api/v1/projects/{projectId}
     */
    getProjectById(projectId: string): Observable<ProjectResponse> {
        console.log('🔍 DesignLabService - Getting project by ID:', projectId);

        return this.http.get<ProjectResponse>(`${BASE_URL}/${projectId}`, {
            headers: this.getAuthHeaders()
        }).pipe(
            map((response) => {
                console.log('✅ DesignLabService - Project fetched successfully:', response.id);
                return response;
            }),
            catchError(this.handleError)
        );
    }

    /**
     * Create new project
     * POST /api/v1/projects
     */
    createProject(request: CreateProjectRequest): Observable<ProjectResponse> {
        console.log('🆕 DesignLabService - Creating new project:', request);

        return this.http.post<ProjectResponse>(BASE_URL, request, {
            headers: this.getAuthHeaders()
        }).pipe(
            map((response) => {
                console.log('✅ DesignLabService - Project created successfully:', response.id);
                return response;
            }),
            catchError(this.handleError)
        );
    }

    /**
     * Get project details for product catalog
     * GET /api/v1/projects/{projectId}/details
     */
    getProjectDetailsForProduct(projectId: string): Observable<ProjectDetailsResponse> {
        console.log('🔍 DesignLabService - Getting project details for product:', projectId);

        return this.http.get<ProjectDetailsResponse>(`${BASE_URL}/${projectId}/details`, {
            headers: this.getAuthHeaders()
        }).pipe(
            map((response) => {
                console.log('✅ DesignLabService - Project details fetched successfully');
                return response;
            }),
            catchError(this.handleError)
        );
    }

    /**
     * Update project details
     * PUT /api/v1/projects/{projectId}/details
     */
    updateProjectDetails(projectId: string, request: UpdateProjectDetailsRequest): Observable<ProjectResponse> {
        console.log('📝 DesignLabService - Updating project details:', projectId, request);

        return this.http.put<ProjectResponse>(`${BASE_URL}/${projectId}/details`, request, {
            headers: this.getAuthHeaders()
        }).pipe(
            map((response) => {
                console.log('✅ DesignLabService - Project details updated successfully');
                return response;
            }),
            catchError(this.handleError)
        );
    }

    /**
     * Update entire project (legacy support)
     * PUT /api/v1/projects/{projectId}
     */
    updateProject(projectId: string, request: UpdateProjectRequest): Observable<ProjectResponse> {
        console.log('📝 DesignLabService - Updating entire project:', projectId);

        return this.http.put<ProjectResponse>(`${BASE_URL}/${projectId}`, request, {
            headers: this.getAuthHeaders()
        }).pipe(
            map((response) => {
                console.log('✅ DesignLabService - Project updated successfully');
                return response;
            }),
            catchError(this.handleError)
        );
    }

    /**
     * Delete project
     * DELETE /api/v1/projects/{projectId}
     */
    deleteProject(projectId: string): Observable<DeleteProjectResponse> {
        console.log('🗑️ DesignLabService - Deleting project:', projectId);

        return this.http.delete<DeleteProjectResponse>(`${BASE_URL}/${projectId}`, {
            headers: this.getAuthHeaders()
        }).pipe(
            map((response) => {
                console.log('✅ DesignLabService - Project deleted successfully');
                return response;
            }),
            catchError(this.handleError)
        );
    }

    // ==================== LAYER ENDPOINTS ====================

    /**
     * Create text layer
     * POST /api/v1/projects/{projectId}/texts
     */
    createTextLayer(projectId: string, request: CreateTextLayerRequest): Observable<TextLayerResponse> {
        console.log('📝 DesignLabService - Creating text layer for project:', projectId, request);

        return this.http.post<TextLayerResponse>(`${BASE_URL}/${projectId}/texts`, request, {
            headers: this.getAuthHeaders()
        }).pipe(
            map((response) => {
                console.log('✅ DesignLabService - Text layer created successfully:', response.id);
                return response;
            }),
            catchError(this.handleError)
        );
    }

    /**
     * Create image layer
     * POST /api/v1/projects/{projectId}/images
     */
    createImageLayer(projectId: string, request: CreateImageLayerRequest): Observable<ImageLayerResponse> {
        console.log('🖼️ DesignLabService - Creating image layer for project:', projectId, request);

        return this.http.post<ImageLayerResponse>(`${BASE_URL}/${projectId}/images`, request, {
            headers: this.getAuthHeaders()
        }).pipe(
            map((response) => {
                console.log('✅ DesignLabService - Image layer created successfully:', response.id);
                return response;
            }),
            catchError(this.handleError)
        );
    }

    /**
     * Update text layer details
     * PUT /api/v1/projects/{projectId}/layers/{layerId}/text-details
     */
    updateTextLayerDetails(
        projectId: string,
        layerId: string,
        request: UpdateTextLayerDetailsRequest
    ): Observable<TextLayerResponse> {
        console.log('📝 DesignLabService - Updating text layer details:', projectId, layerId, request);

        return this.http.put<TextLayerResponse>(
            `${BASE_URL}/${projectId}/layers/${layerId}/text-details`,
            request,
            { headers: this.getAuthHeaders() }
        ).pipe(
            map((response) => {
                console.log('✅ DesignLabService - Text layer details updated successfully');
                return response;
            }),
            catchError(this.handleError)
        );
    }

    /**
     * Update image layer details
     * PUT /api/v1/projects/{projectId}/layers/{layerId}/image-details
     */
    updateImageLayerDetails(
        projectId: string,
        layerId: string,
        request: UpdateImageLayerDetailsRequest
    ): Observable<ImageLayerResponse> {
        console.log('🖼️ DesignLabService - Updating image layer details:', projectId, layerId, request);

        return this.http.put<ImageLayerResponse>(
            `${BASE_URL}/${projectId}/layers/${layerId}/image-details`,
            request,
            { headers: this.getAuthHeaders() }
        ).pipe(
            map((response) => {
                console.log('✅ DesignLabService - Image layer details updated successfully');
                return response;
            }),
            catchError(this.handleError)
        );
    }

    /**
     * Update layer coordinates
     * PUT /api/v1/projects/{projectId}/layers/{layerId}/coordinates
     */
    updateLayerCoordinates(
        projectId: string,
        layerId: string,
        request: UpdateLayerCoordinatesRequest
    ): Observable<LayerResponse> {
        console.log('📍 DesignLabService - Updating layer coordinates:', projectId, layerId, request);

        return this.http.put<LayerResponse>(
            `${BASE_URL}/${projectId}/layers/${layerId}/coordinates`,
            request,
            { headers: this.getAuthHeaders() }
        ).pipe(
            map((response) => {
                console.log('✅ DesignLabService - Layer coordinates updated successfully');
                return response;
            }),
            catchError(this.handleError)
        );
    }

    /**
     * Delete layer
     * DELETE /api/v1/projects/{projectId}/layers/{layerId}
     */
    deleteLayer(projectId: string, layerId: string): Observable<DeleteLayerResponse> {
        console.log('🗑️ DesignLabService - Deleting layer:', projectId, layerId);

        return this.http.delete<DeleteLayerResponse>(
            `${BASE_URL}/${projectId}/layers/${layerId}`,
            { headers: this.getAuthHeaders() }
        ).pipe(
            map((response) => {
                console.log('✅ DesignLabService - Layer deleted successfully');
                return response;
            }),
            catchError(this.handleError)
        );
    }

    // ==================== UTILITY METHODS ====================

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        return !!(token && userId);
    }

    /**
     * Get current user ID
     */
    getCurrentUserId(): string | null {
        return localStorage.getItem('userId');
    }
}
