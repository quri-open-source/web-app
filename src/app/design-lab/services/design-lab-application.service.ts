/**
 * Design Lab Application Service
 * Main facade for Design Lab bounded context
 * Follows DDD Application Service pattern
 */

import { Injectable, inject } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

// Command and Query Services
import { DesignLabCommandService } from './commands/design-lab-command.service';
import { DesignLabQueryService } from './queries/design-lab-query.service';

// Commands
import { 
    CreateProjectCommand, 
    UpdateProjectCommand, 
    DeleteProjectCommand,
    ProjectCommandResult
} from './commands/project-commands';

import {
    CreateTextLayerCommand,
    CreateImageLayerCommand,
    UpdateTextLayerDetailsCommand,
    UpdateImageLayerDetailsCommand,
    UpdateLayerCoordinatesCommand,
    DeleteLayerCommand,
    LayerCommandResult
} from './commands/layer-commands';

// Queries
import {
    GetAllProjectsByUserIdQuery,
    GetProjectByIdQuery,
    GetProjectDetailsForProductQuery,
    GetLayersByProjectIdQuery,
    GetLayersByTypeQuery
} from './queries/design-lab-queries';

// Domain Models
import { Project } from '../model/project.entity';
import { Layer } from '../model/layer.entity';

// Configuration
import { DESIGN_LAB_CONFIG, DESIGN_LAB_ERROR_MESSAGES } from '../config/design-lab.config';

/**
 * Design Lab Application Service
 * Acts as the main entry point for all Design Lab operations
 * Orchestrates commands and queries following CQRS pattern
 */
@Injectable({
    providedIn: 'root',
})
export class DesignLabApplicationService {
    private commandService = inject(DesignLabCommandService);
    private queryService = inject(DesignLabQueryService);

    // ==================== PROJECT OPERATIONS ====================

    /**
     * Create a new project
     */
    createProject(command: CreateProjectCommand): Observable<ProjectCommandResult> {
        console.log('🚀 DesignLabApplicationService - Creating project:', command.title);
        
        return from(this.commandService.createProject(command)).pipe(
            map(result => {
                console.log('✅ DesignLabApplicationService - Project created successfully');
                return result;
            }),
            catchError(error => {
                console.error('❌ DesignLabApplicationService - Error creating project:', error);
                throw error;
            })
        );
    }

    /**
     * Update an existing project
     */
    updateProject(command: UpdateProjectCommand): Observable<ProjectCommandResult> {
        console.log('📝 DesignLabApplicationService - Updating project:', command.id);
        
        return from(this.commandService.updateProject(command)).pipe(
            map(result => {
                console.log('✅ DesignLabApplicationService - Project updated successfully');
                return result;
            }),
            catchError(error => {
                console.error('❌ DesignLabApplicationService - Error updating project:', error);
                throw error;
            })
        );
    }

    /**
     * Delete a project
     */
    deleteProject(command: DeleteProjectCommand): Observable<ProjectCommandResult> {
        console.log('🗑️ DesignLabApplicationService - Deleting project:', command.projectId);
        
        return from(this.commandService.deleteProject(command)).pipe(
            map(result => {
                console.log('✅ DesignLabApplicationService - Project deleted successfully');
                return result;
            }),
            catchError(error => {
                console.error('❌ DesignLabApplicationService - Error deleting project:', error);
                throw error;
            })
        );
    }

    /**
     * Get all projects for a user
     */
    getAllProjectsByUserId(userId: string): Observable<Project[]> {
        console.log('🔍 DesignLabApplicationService - Getting projects for user:', userId);
        
        const query: GetAllProjectsByUserIdQuery = { userId };
        
        return from(this.queryService.getAllProjectsByUserId(query)).pipe(
            map(result => {
                if (result.success && result.data) {
                    console.log('✅ DesignLabApplicationService - Projects retrieved successfully');
                    return this.queryService.convertToProjectEntities(result.data);
                }
                throw new Error(result.error || DESIGN_LAB_ERROR_MESSAGES.PROJECT_NOT_FOUND);
            }),
            catchError(error => {
                console.error('❌ DesignLabApplicationService - Error getting projects:', error);
                throw error;
            })
        );
    }

    /**
     * Get project by ID
     */
    getProjectById(projectId: string): Observable<Project> {
        console.log('🔍 DesignLabApplicationService - Getting project by ID:', projectId);
        
        const query: GetProjectByIdQuery = { projectId };
        
        return from(this.queryService.getProjectById(query)).pipe(
            map(result => {
                if (result.success && result.data) {
                    console.log('✅ DesignLabApplicationService - Project retrieved successfully');
                    return this.queryService.convertToProjectEntity(result.data);
                }
                throw new Error(result.error || DESIGN_LAB_ERROR_MESSAGES.PROJECT_NOT_FOUND);
            }),
            catchError(error => {
                console.error('❌ DesignLabApplicationService - Error getting project:', error);
                throw error;
            })
        );
    }

    /**
     * Get project details for product catalog
     */
    getProjectDetailsForProduct(projectId: string): Observable<any> {
        console.log('🔍 DesignLabApplicationService - Getting project details for product:', projectId);
        
        const query: GetProjectDetailsForProductQuery = { projectId };
        
        return from(this.queryService.getProjectDetailsForProduct(query)).pipe(
            map(result => {
                if (result.success && result.data) {
                    console.log('✅ DesignLabApplicationService - Project details retrieved successfully');
                    return result.data;
                }
                throw new Error(result.error || DESIGN_LAB_ERROR_MESSAGES.PROJECT_NOT_FOUND);
            }),
            catchError(error => {
                console.error('❌ DesignLabApplicationService - Error getting project details:', error);
                throw error;
            })
        );
    }

    // ==================== LAYER OPERATIONS ====================

    /**
     * Create a text layer
     */
    createTextLayer(command: CreateTextLayerCommand): Observable<LayerCommandResult> {
        console.log('📝 DesignLabApplicationService - Creating text layer');
        
        return from(this.commandService.createTextLayer(command)).pipe(
            map(result => {
                console.log('✅ DesignLabApplicationService - Text layer created successfully');
                return result;
            }),
            catchError(error => {
                console.error('❌ DesignLabApplicationService - Error creating text layer:', error);
                throw error;
            })
        );
    }

    /**
     * Create an image layer
     */
    createImageLayer(command: CreateImageLayerCommand): Observable<LayerCommandResult> {
        console.log('🖼️ DesignLabApplicationService - Creating image layer');
        
        return from(this.commandService.createImageLayer(command)).pipe(
            map(result => {
                console.log('✅ DesignLabApplicationService - Image layer created successfully');
                return result;
            }),
            catchError(error => {
                console.error('❌ DesignLabApplicationService - Error creating image layer:', error);
                throw error;
            })
        );
    }

    /**
     * Update text layer details
     */
    updateTextLayerDetails(command: UpdateTextLayerDetailsCommand): Observable<LayerCommandResult> {
        console.log('📝 DesignLabApplicationService - Updating text layer details');
        
        return from(this.commandService.updateTextLayerDetails(command)).pipe(
            map(result => {
                console.log('✅ DesignLabApplicationService - Text layer details updated successfully');
                return result;
            }),
            catchError(error => {
                console.error('❌ DesignLabApplicationService - Error updating text layer details:', error);
                throw error;
            })
        );
    }

    /**
     * Update image layer details
     */
    updateImageLayerDetails(command: UpdateImageLayerDetailsCommand): Observable<LayerCommandResult> {
        console.log('🖼️ DesignLabApplicationService - Updating image layer details');
        
        return from(this.commandService.updateImageLayerDetails(command)).pipe(
            map(result => {
                console.log('✅ DesignLabApplicationService - Image layer details updated successfully');
                return result;
            }),
            catchError(error => {
                console.error('❌ DesignLabApplicationService - Error updating image layer details:', error);
                throw error;
            })
        );
    }

    /**
     * Update layer coordinates
     */
    updateLayerCoordinates(command: UpdateLayerCoordinatesCommand): Observable<LayerCommandResult> {
        console.log('📍 DesignLabApplicationService - Updating layer coordinates');
        
        return from(this.commandService.updateLayerCoordinates(command)).pipe(
            map(result => {
                console.log('✅ DesignLabApplicationService - Layer coordinates updated successfully');
                return result;
            }),
            catchError(error => {
                console.error('❌ DesignLabApplicationService - Error updating layer coordinates:', error);
                throw error;
            })
        );
    }

    /**
     * Delete a layer
     */
    deleteLayer(command: DeleteLayerCommand): Observable<LayerCommandResult> {
        console.log('🗑️ DesignLabApplicationService - Deleting layer');
        
        return from(this.commandService.deleteLayer(command)).pipe(
            map(result => {
                console.log('✅ DesignLabApplicationService - Layer deleted successfully');
                return result;
            }),
            catchError(error => {
                console.error('❌ DesignLabApplicationService - Error deleting layer:', error);
                throw error;
            })
        );
    }

    /**
     * Get layers by project ID
     */
    getLayersByProjectId(projectId: string): Observable<Layer[]> {
        console.log('🔍 DesignLabApplicationService - Getting layers for project:', projectId);
        
        const query: GetLayersByProjectIdQuery = { projectId };
        
        return from(this.queryService.getLayersByProjectId(query)).pipe(
            map(result => {
                if (result.success && result.data) {
                    console.log('✅ DesignLabApplicationService - Layers retrieved successfully');
                    return this.queryService.convertToLayerEntities(result.data);
                }
                throw new Error(result.error || DESIGN_LAB_ERROR_MESSAGES.LAYER_NOT_FOUND);
            }),
            catchError(error => {
                console.error('❌ DesignLabApplicationService - Error getting layers:', error);
                throw error;
            })
        );
    }

    /**
     * Get layers by type
     */
    getLayersByType(projectId: string, type: 'TEXT' | 'IMAGE'): Observable<Layer[]> {
        console.log('🔍 DesignLabApplicationService - Getting layers by type:', type);
        
        const query: GetLayersByTypeQuery = { projectId, type };
        
        return from(this.queryService.getLayersByType(query)).pipe(
            map(result => {
                if (result.success && result.data) {
                    console.log('✅ DesignLabApplicationService - Layers by type retrieved successfully');
                    return this.queryService.convertToLayerEntities(result.data);
                }
                throw new Error(result.error || DESIGN_LAB_ERROR_MESSAGES.LAYER_NOT_FOUND);
            }),
            catchError(error => {
                console.error('❌ DesignLabApplicationService - Error getting layers by type:', error);
                throw error;
            })
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

    /**
     * Get configuration
     */
    getConfig() {
        return DESIGN_LAB_CONFIG;
    }
}
