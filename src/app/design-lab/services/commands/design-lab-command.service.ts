/**
 * Design Lab - Command Service
 * Following CQRS pattern - Handles write operations
 */

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { AuthenticationService } from '../../../iam/services/authentication.service';

// Commands
import {
    CreateProjectCommand,
    UpdateProjectCommand,
    DeleteProjectCommand,
    ProjectCommandResult
} from '../commands/project-commands';

import {
    CreateTextLayerCommand,
    CreateImageLayerCommand,
    UpdateTextLayerDetailsCommand,
    UpdateImageLayerDetailsCommand,
    UpdateLayerCoordinatesCommand,
    DeleteLayerCommand,
    LayerCommandResult
} from '../commands/layer-commands';

// Responses
import {
    ProjectResponse,
    TextLayerResponse,
    ImageLayerResponse,
    LayerResponse,
    DeleteLayerResponse,
    DeleteProjectResponse
} from '../design-lab.response';

const BASE_URL = `${environment.apiBaseUrl}/projects`;

@Injectable({
    providedIn: 'root',
})
export class DesignLabCommandService {
    private http = inject(HttpClient);
    private authService = inject(AuthenticationService);

    // ==================== PROJECT COMMANDS ====================

    /**
     * Handle CreateProjectCommand
     */
    async createProject(command: CreateProjectCommand): Promise<ProjectCommandResult> {
        try {
            console.log('🚀 DesignLabCommandService - Creating project:', command);

            const request = {
                title: command.title,
                userId: command.userId,
                garmentColor: command.garmentColor,
                garmentGender: command.garmentGender,
                garmentSize: command.garmentSize
            };

            const response = await this.http.post<ProjectResponse>(
                BASE_URL,
                request,
                { headers: this.getAuthHeaders() }
            ).toPromise();

            console.log('✅ DesignLabCommandService - Project created successfully:', response?.id);

            return {
                success: true,
                projectId: response?.id,
                message: 'Project created successfully'
            };
        } catch (error) {
            console.error('❌ DesignLabCommandService - Error creating project:', error);
            return {
                success: false,
                error: this.getErrorMessage(error)
            };
        }
    }

    /**
     * Handle UpdateProjectCommand
     */
    async updateProject(command: UpdateProjectCommand): Promise<ProjectCommandResult> {
        try {
            console.log('📝 DesignLabCommandService - Updating project:', command);

            const request = {
                previewUrl: command.previewUrl,
                status: command.status,
                garmentColor: command.garmentColor,
                garmentSize: command.garmentSize,
                garmentGender: command.garmentGender
            };

            await this.http.put<ProjectResponse>(
                `${BASE_URL}/${command.id}/details`,
                request,
                { headers: this.getAuthHeaders() }
            ).toPromise();

            console.log('✅ DesignLabCommandService - Project updated successfully');

            return {
                success: true,
                projectId: command.id,
                message: 'Project updated successfully'
            };
        } catch (error) {
            console.error('❌ DesignLabCommandService - Error updating project:', error);
            return {
                success: false,
                error: this.getErrorMessage(error)
            };
        }
    }

    /**
     * Handle DeleteProjectCommand
     */
    async deleteProject(command: DeleteProjectCommand): Promise<ProjectCommandResult> {
        try {
            console.log('🗑️ DesignLabCommandService - Deleting project:', command);

            await this.http.delete<DeleteProjectResponse>(
                `${BASE_URL}/${command.projectId}`,
                { headers: this.getAuthHeaders() }
            ).toPromise();

            console.log('✅ DesignLabCommandService - Project deleted successfully');

            return {
                success: true,
                projectId: command.projectId,
                message: 'Project deleted successfully'
            };
        } catch (error) {
            console.error('❌ DesignLabCommandService - Error deleting project:', error);
            return {
                success: false,
                error: this.getErrorMessage(error)
            };
        }
    }

    // ==================== LAYER COMMANDS ====================

    /**
     * Handle CreateTextLayerCommand
     */
    async createTextLayer(command: CreateTextLayerCommand): Promise<LayerCommandResult> {
        try {
            console.log('📝 DesignLabCommandService - Creating text layer:', command);

            const request = {
                text: command.text,
                fontColor: command.fontColor,
                fontFamily: command.fontFamily,
                fontSize: command.fontSize,
                isBold: command.isBold,
                isItalic: command.isItalic,
                isUnderlined: command.isUnderlined,
                projectId: command.projectId
            };

            const response = await this.http.post<TextLayerResponse>(
                `${BASE_URL}/${command.projectId}/texts`,
                request,
                { headers: this.getAuthHeaders() }
            ).toPromise();

            console.log('✅ DesignLabCommandService - Text layer created successfully:', response?.id);

            return {
                success: true,
                layerId: response?.id,
                projectId: command.projectId,
                message: 'Text layer created successfully'
            };
        } catch (error) {
            console.error('❌ DesignLabCommandService - Error creating text layer:', error);
            return {
                success: false,
                error: this.getErrorMessage(error)
            };
        }
    }

    /**
     * Handle CreateImageLayerCommand
     */
    async createImageLayer(command: CreateImageLayerCommand): Promise<LayerCommandResult> {
        try {
            console.log('🖼️ DesignLabCommandService - Creating image layer:', command);

            const request = {
                imageUrl: command.imageUrl,
                width: command.width,
                height: command.height,
                projectId: command.projectId
            };

            const response = await this.http.post<ImageLayerResponse>(
                `${BASE_URL}/${command.projectId}/images`,
                request,
                { headers: this.getAuthHeaders() }
            ).toPromise();

            console.log('✅ DesignLabCommandService - Image layer created successfully:', response?.id);

            return {
                success: true,
                layerId: response?.id,
                projectId: command.projectId,
                message: 'Image layer created successfully'
            };
        } catch (error) {
            console.error('❌ DesignLabCommandService - Error creating image layer:', error);
            return {
                success: false,
                error: this.getErrorMessage(error)
            };
        }
    }

    /**
     * Handle UpdateTextLayerDetailsCommand
     */
    async updateTextLayerDetails(command: UpdateTextLayerDetailsCommand): Promise<LayerCommandResult> {
        try {
            console.log('📝 DesignLabCommandService - Updating text layer details:', command);

            const request = {
                text: command.text,
                fontColor: command.fontColor,
                fontFamily: command.fontFamily,
                fontSize: command.fontSize,
                isBold: command.isBold,
                isItalic: command.isItalic,
                isUnderlined: command.isUnderlined
            };

            await this.http.put<TextLayerResponse>(
                `${BASE_URL}/${command.projectId}/layers/${command.layerId}/text-details`,
                request,
                { headers: this.getAuthHeaders() }
            ).toPromise();

            console.log('✅ DesignLabCommandService - Text layer details updated successfully');

            return {
                success: true,
                layerId: command.layerId,
                projectId: command.projectId,
                message: 'Text layer details updated successfully'
            };
        } catch (error) {
            console.error('❌ DesignLabCommandService - Error updating text layer details:', error);
            return {
                success: false,
                error: this.getErrorMessage(error)
            };
        }
    }

    /**
     * Handle UpdateImageLayerDetailsCommand
     */
    async updateImageLayerDetails(command: UpdateImageLayerDetailsCommand): Promise<LayerCommandResult> {
        try {
            console.log('🖼️ DesignLabCommandService - Updating image layer details:', command);

            const request = {
                imageUrl: command.imageUrl,
                width: command.width,
                height: command.height
            };

            await this.http.put<ImageLayerResponse>(
                `${BASE_URL}/${command.projectId}/layers/${command.layerId}/image-details`,
                request,
                { headers: this.getAuthHeaders() }
            ).toPromise();

            console.log('✅ DesignLabCommandService - Image layer details updated successfully');

            return {
                success: true,
                layerId: command.layerId,
                projectId: command.projectId,
                message: 'Image layer details updated successfully'
            };
        } catch (error) {
            console.error('❌ DesignLabCommandService - Error updating image layer details:', error);
            return {
                success: false,
                error: this.getErrorMessage(error)
            };
        }
    }

    /**
     * Handle UpdateLayerCoordinatesCommand
     */
    async updateLayerCoordinates(command: UpdateLayerCoordinatesCommand): Promise<LayerCommandResult> {
        try {
            console.log('📍 DesignLabCommandService - Updating layer coordinates:', command);

            const request = {
                x: command.x,
                y: command.y,
                z: command.z
            };

            await this.http.put<LayerResponse>(
                `${BASE_URL}/${command.projectId}/layers/${command.layerId}/coordinates`,
                request,
                { headers: this.getAuthHeaders() }
            ).toPromise();

            console.log('✅ DesignLabCommandService - Layer coordinates updated successfully');

            return {
                success: true,
                layerId: command.layerId,
                projectId: command.projectId,
                message: 'Layer coordinates updated successfully'
            };
        } catch (error) {
            console.error('❌ DesignLabCommandService - Error updating layer coordinates:', error);
            return {
                success: false,
                error: this.getErrorMessage(error)
            };
        }
    }

    /**
     * Handle DeleteLayerCommand
     */
    async deleteLayer(command: DeleteLayerCommand): Promise<LayerCommandResult> {
        try {
            console.log('🗑️ DesignLabCommandService - Deleting layer:', command);

            await this.http.delete<DeleteLayerResponse>(
                `${BASE_URL}/${command.projectId}/layers/${command.layerId}`,
                { headers: this.getAuthHeaders() }
            ).toPromise();

            console.log('✅ DesignLabCommandService - Layer deleted successfully');

            return {
                success: true,
                layerId: command.layerId,
                projectId: command.projectId,
                message: 'Layer deleted successfully'
            };
        } catch (error) {
            console.error('❌ DesignLabCommandService - Error deleting layer:', error);
            return {
                success: false,
                error: this.getErrorMessage(error)
            };
        }
    }

    // ==================== UTILITY METHODS ====================

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
