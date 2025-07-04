/**
 * Design Lab - Query Service
 * Following CQRS pattern - Handles read operations
 */

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { AuthenticationService } from '../../../iam/services/authentication.service';

// Queries
import { 
    GetAllProjectsByUserIdQuery,
    GetProjectByIdQuery,
    GetProjectDetailsForProductQuery,
    GetProjectsByStatusQuery,
    GetProjectsByGarmentColorQuery,
    GetLayerByIdQuery,
    GetLayersByProjectIdQuery,
    GetLayersByTypeQuery,
    GetVisibleLayersQuery,
    ProjectQueryResult,
    LayerQueryResult
} from '../queries/design-lab-queries';

// Responses
import {
    ProjectResponse,
    ProjectDetailsResponse,
    LayerResponse
} from '../design-lab.response';

// Assemblers
import { DesignLabAssembler } from '../design-lab.assembler';

const BASE_URL = `${environment.apiBaseUrl}/projects`;

@Injectable({
    providedIn: 'root',
})
export class DesignLabQueryService {
    private http = inject(HttpClient);
    private authService = inject(AuthenticationService);

    // ==================== PROJECT QUERIES ====================

    /**
     * Handle GetAllProjectsByUserIdQuery
     */
    async getAllProjectsByUserId(query: GetAllProjectsByUserIdQuery): Promise<ProjectQueryResult> {
        try {
            console.log('🔍 DesignLabQueryService - Getting projects for user:', query.userId);
            
            const response = await this.http.get<ProjectResponse[]>(
                `${BASE_URL}?userId=${query.userId}`,
                { headers: this.getAuthHeaders() }
            ).toPromise();

            console.log('✅ DesignLabQueryService - Projects fetched successfully:', response?.length);
            
            return {
                success: true,
                data: response || [],
                message: 'Projects retrieved successfully'
            };
        } catch (error) {
            console.error('❌ DesignLabQueryService - Error fetching projects:', error);
            return {
                success: false,
                error: this.getErrorMessage(error)
            };
        }
    }

    /**
     * Handle GetProjectByIdQuery
     */
    async getProjectById(query: GetProjectByIdQuery): Promise<ProjectQueryResult> {
        try {
            console.log('🔍 DesignLabQueryService - Getting project by ID:', query.projectId);
            
            const response = await this.http.get<ProjectResponse>(
                `${BASE_URL}/${query.projectId}`,
                { headers: this.getAuthHeaders() }
            ).toPromise();

            console.log('✅ DesignLabQueryService - Project fetched successfully:', response?.id);
            
            return {
                success: true,
                data: response,
                message: 'Project retrieved successfully'
            };
        } catch (error) {
            console.error('❌ DesignLabQueryService - Error fetching project:', error);
            return {
                success: false,
                error: this.getErrorMessage(error)
            };
        }
    }

    /**
     * Handle GetProjectDetailsForProductQuery
     */
    async getProjectDetailsForProduct(query: GetProjectDetailsForProductQuery): Promise<ProjectQueryResult> {
        try {
            console.log('🔍 DesignLabQueryService - Getting project details for product:', query.projectId);
            
            const response = await this.http.get<ProjectDetailsResponse>(
                `${BASE_URL}/${query.projectId}/details`,
                { headers: this.getAuthHeaders() }
            ).toPromise();

            console.log('✅ DesignLabQueryService - Project details fetched successfully');
            
            return {
                success: true,
                data: response,
                message: 'Project details retrieved successfully'
            };
        } catch (error) {
            console.error('❌ DesignLabQueryService - Error fetching project details:', error);
            return {
                success: false,
                error: this.getErrorMessage(error)
            };
        }
    }

    /**
     * Handle GetProjectsByStatusQuery
     */
    async getProjectsByStatus(query: GetProjectsByStatusQuery): Promise<ProjectQueryResult> {
        try {
            console.log('🔍 DesignLabQueryService - Getting projects by status:', query);
            
            const response = await this.http.get<ProjectResponse[]>(
                `${BASE_URL}?userId=${query.userId}&status=${query.status}`,
                { headers: this.getAuthHeaders() }
            ).toPromise();

            console.log('✅ DesignLabQueryService - Projects by status fetched successfully:', response?.length);
            
            return {
                success: true,
                data: response || [],
                message: 'Projects by status retrieved successfully'
            };
        } catch (error) {
            console.error('❌ DesignLabQueryService - Error fetching projects by status:', error);
            return {
                success: false,
                error: this.getErrorMessage(error)
            };
        }
    }

    /**
     * Handle GetProjectsByGarmentColorQuery
     */
    async getProjectsByGarmentColor(query: GetProjectsByGarmentColorQuery): Promise<ProjectQueryResult> {
        try {
            console.log('🔍 DesignLabQueryService - Getting projects by garment color:', query);
            
            const response = await this.http.get<ProjectResponse[]>(
                `${BASE_URL}?userId=${query.userId}&garmentColor=${query.garmentColor}`,
                { headers: this.getAuthHeaders() }
            ).toPromise();

            console.log('✅ DesignLabQueryService - Projects by garment color fetched successfully:', response?.length);
            
            return {
                success: true,
                data: response || [],
                message: 'Projects by garment color retrieved successfully'
            };
        } catch (error) {
            console.error('❌ DesignLabQueryService - Error fetching projects by garment color:', error);
            return {
                success: false,
                error: this.getErrorMessage(error)
            };
        }
    }

    // ==================== LAYER QUERIES ====================

    /**
     * Handle GetLayerByIdQuery
     */
    async getLayerById(query: GetLayerByIdQuery): Promise<LayerQueryResult> {
        try {
            console.log('🔍 DesignLabQueryService - Getting layer by ID:', query);
            
            const response = await this.http.get<LayerResponse>(
                `${BASE_URL}/${query.projectId}/layers/${query.layerId}`,
                { headers: this.getAuthHeaders() }
            ).toPromise();

            console.log('✅ DesignLabQueryService - Layer fetched successfully:', response?.id);
            
            return {
                success: true,
                data: response,
                message: 'Layer retrieved successfully'
            };
        } catch (error) {
            console.error('❌ DesignLabQueryService - Error fetching layer:', error);
            return {
                success: false,
                error: this.getErrorMessage(error)
            };
        }
    }

    /**
     * Handle GetLayersByProjectIdQuery
     */
    async getLayersByProjectId(query: GetLayersByProjectIdQuery): Promise<LayerQueryResult> {
        try {
            console.log('🔍 DesignLabQueryService - Getting layers by project ID:', query.projectId);
            
            const response = await this.http.get<LayerResponse[]>(
                `${BASE_URL}/${query.projectId}/layers`,
                { headers: this.getAuthHeaders() }
            ).toPromise();

            console.log('✅ DesignLabQueryService - Layers fetched successfully:', response?.length);
            
            return {
                success: true,
                data: response || [],
                message: 'Layers retrieved successfully'
            };
        } catch (error) {
            console.error('❌ DesignLabQueryService - Error fetching layers:', error);
            return {
                success: false,
                error: this.getErrorMessage(error)
            };
        }
    }

    /**
     * Handle GetLayersByTypeQuery
     */
    async getLayersByType(query: GetLayersByTypeQuery): Promise<LayerQueryResult> {
        try {
            console.log('🔍 DesignLabQueryService - Getting layers by type:', query);
            
            const response = await this.http.get<LayerResponse[]>(
                `${BASE_URL}/${query.projectId}/layers?type=${query.type}`,
                { headers: this.getAuthHeaders() }
            ).toPromise();

            console.log('✅ DesignLabQueryService - Layers by type fetched successfully:', response?.length);
            
            return {
                success: true,
                data: response || [],
                message: 'Layers by type retrieved successfully'
            };
        } catch (error) {
            console.error('❌ DesignLabQueryService - Error fetching layers by type:', error);
            return {
                success: false,
                error: this.getErrorMessage(error)
            };
        }
    }

    /**
     * Handle GetVisibleLayersQuery
     */
    async getVisibleLayers(query: GetVisibleLayersQuery): Promise<LayerQueryResult> {
        try {
            console.log('🔍 DesignLabQueryService - Getting visible layers:', query);
            
            const response = await this.http.get<LayerResponse[]>(
                `${BASE_URL}/${query.projectId}/layers?visible=${query.isVisible}`,
                { headers: this.getAuthHeaders() }
            ).toPromise();

            console.log('✅ DesignLabQueryService - Visible layers fetched successfully:', response?.length);
            
            return {
                success: true,
                data: response || [],
                message: 'Visible layers retrieved successfully'
            };
        } catch (error) {
            console.error('❌ DesignLabQueryService - Error fetching visible layers:', error);
            return {
                success: false,
                error: this.getErrorMessage(error)
            };
        }
    }

    // ==================== UTILITY METHODS ====================

    /**
     * Convert ProjectResponse to Project Entity
     */
    convertToProjectEntity(response: ProjectResponse) {
        return DesignLabAssembler.toProjectEntity(response);
    }

    /**
     * Convert LayerResponse to Layer Entity
     */
    convertToLayerEntity(response: LayerResponse) {
        return DesignLabAssembler.toLayerEntity(response);
    }

    /**
     * Convert array of ProjectResponse to Project Entities
     */
    convertToProjectEntities(responses: ProjectResponse[]) {
        return DesignLabAssembler.toProjectEntityArray(responses);
    }

    /**
     * Convert array of LayerResponse to Layer Entities
     */
    convertToLayerEntities(responses: LayerResponse[]) {
        return DesignLabAssembler.toLayerEntityArray(responses);
    }

    private getAuthHeaders() {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        };
    }

    private getErrorMessage(error: any): string {
        if (error?.error?.message) {
            return error.error.message;
        }
        if (error?.message) {
            return error.message;
        }
        return 'An unexpected error occurred';
    }
}
