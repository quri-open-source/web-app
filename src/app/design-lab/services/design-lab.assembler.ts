import { Layer, TextLayer, ImageLayer } from '../model/layer.entity';
import { Project } from '../model/project.entity';
import { 
    LayerResponse, 
    TextLayerResponse, 
    ImageLayerResponse,
    ProjectResponse,
    ProjectDetailsResponse
} from './design-lab.response';
import {
    CreateTextLayerRequest,
    CreateImageLayerRequest,
    UpdateTextLayerDetailsRequest,
    UpdateImageLayerDetailsRequest,
    UpdateLayerCoordinatesRequest
} from './project.request';

/**
 * Design Lab Assembler - Transforms between Domain Entities and DTOs
 * Following DDD Anti-Corruption Layer pattern
 */
export class DesignLabAssembler {

    // ==================== PROJECT ASSEMBLERS ====================

    /**
     * Transform Project entity to ProjectResponse DTO
     */
    static toProjectResponse(project: Project): ProjectResponse {
        return {
            id: project.id,
            title: project.title,
            userId: project.userId,
            previewUrl: project.previewUrl || undefined,
            status: project.status,
            garmentColor: project.garmentColor,
            garmentSize: project.garmentSize,
            garmentGender: project.garmentGender,
            layers: project.layers?.map(layer => this.toLayerResponse(layer)) || [],
            createdAt: project.createdAt.toISOString(),
            updatedAt: project.updatedAt.toISOString()
        };
    }

    /**
     * Transform Project entity to ProjectDetailsResponse DTO
     */
    static toProjectDetailsResponse(project: Project): ProjectDetailsResponse {
        return {
            id: project.id,
            title: project.title,
            previewUrl: project.previewUrl || undefined,
            userId: project.userId
        };
    }

    /**
     * Transform ProjectResponse DTO to Project entity
     */
    static toProjectEntity(response: ProjectResponse): Project {
        const project = new Project(
            response.id,
            response.title,
            response.userId,
            response.previewUrl || null,
            response.status as any,
            response.garmentColor as any,
            response.garmentSize as any,
            response.garmentGender as any,
            response.layers?.map(layer => this.toLayerEntity(layer)) || [],
            new Date(response.createdAt),
            new Date(response.updatedAt)
        );
        return project;
    }

    // ==================== LAYER ASSEMBLERS ====================

    /**
     * Transform Layer entity to LayerResponse DTO (polymorphic)
     */
    static toLayerResponse(layer: Layer): LayerResponse {
        if (layer instanceof TextLayer) {
            return this.toTextLayerResponse(layer);
        } else if (layer instanceof ImageLayer) {
            return this.toImageLayerResponse(layer);
        } else {
            // Base layer response
            return {
                id: layer.id,
                x: layer.x,
                y: layer.y,
                z: layer.z,
                opacity: layer.opacity,
                isVisible: layer.isVisible,
                type: layer.type as 'TEXT' | 'IMAGE',
                createdAt: layer.createdAt.toISOString(),
                updatedAt: layer.updatedAt.toISOString()
            };
        }
    }

    /**
     * Transform TextLayer entity to TextLayerResponse DTO
     */
    static toTextLayerResponse(textLayer: TextLayer): TextLayerResponse {
        return {
            id: textLayer.id,
            x: textLayer.x,
            y: textLayer.y,
            z: textLayer.z,
            opacity: textLayer.opacity,
            isVisible: textLayer.isVisible,
            type: 'TEXT',
            createdAt: textLayer.createdAt.toISOString(),
            updatedAt: textLayer.updatedAt.toISOString(),
            details: {
                text: textLayer.details?.text || '',
                fontColor: textLayer.details?.fontColor || '#000000',
                fontFamily: textLayer.details?.fontFamily || 'Arial',
                fontSize: textLayer.details?.fontSize || 16,
                isBold: textLayer.details?.isBold || false,
                isItalic: textLayer.details?.isItalic || false,
                isUnderlined: textLayer.details?.isUnderlined || false
            }
        };
    }

    /**
     * Transform ImageLayer entity to ImageLayerResponse DTO
     */
    static toImageLayerResponse(imageLayer: ImageLayer): ImageLayerResponse {
        return {
            id: imageLayer.id,
            x: imageLayer.x,
            y: imageLayer.y,
            z: imageLayer.z,
            opacity: imageLayer.opacity,
            isVisible: imageLayer.isVisible,
            type: 'IMAGE',
            createdAt: imageLayer.createdAt.toISOString(),
            updatedAt: imageLayer.updatedAt.toISOString(),
            details: {
                imageUrl: imageLayer.imageUrl || '',
                width: imageLayer.details?.width || 200,
                height: imageLayer.details?.height || 200
            }
        };
    }

    /**
     * Transform LayerResponse DTO to Layer entity (polymorphic)
     */
    static toLayerEntity(response: LayerResponse): Layer {
        if (response.type === 'TEXT') {
            return this.toTextLayerEntity(response as TextLayerResponse);
        } else if (response.type === 'IMAGE') {
            return this.toImageLayerEntity(response as ImageLayerResponse);
        } else {
            throw new Error(`Unknown layer type: ${response.type}`);
        }
    }

    /**
     * Transform TextLayerResponse DTO to TextLayer entity
     */
    static toTextLayerEntity(response: TextLayerResponse): TextLayer {
        return new TextLayer(
            response.id,
            response.x,
            response.y,
            response.z,
            response.opacity,
            response.isVisible,
            new Date(response.createdAt),
            new Date(response.updatedAt),
            {
                text: response.details.text,
                fontColor: response.details.fontColor,
                fontFamily: response.details.fontFamily,
                fontSize: response.details.fontSize,
                isBold: response.details.isBold,
                isItalic: response.details.isItalic,
                isUnderlined: response.details.isUnderlined
            }
        );
    }

    /**
     * Transform ImageLayerResponse DTO to ImageLayer entity
     */
    static toImageLayerEntity(response: ImageLayerResponse): ImageLayer {
        const imageLayer = new ImageLayer(
            response.id,
            response.x,
            response.y,
            response.z,
            response.opacity,
            response.isVisible,
            response.details.imageUrl
        );
        
        // Set width and height from response details
        imageLayer.details = {
            width: response.details.width,
            height: response.details.height
        };
        
        return imageLayer;
    }

    // ==================== REQUEST ASSEMBLERS ====================

    /**
     * Transform TextLayer entity to CreateTextLayerRequest DTO
     */
    static toCreateTextLayerRequest(textLayer: TextLayer, projectId: string): CreateTextLayerRequest {
        return {
            text: textLayer.details?.text || '',
            fontColor: textLayer.details?.fontColor || '#000000',
            fontFamily: textLayer.details?.fontFamily || 'Arial',
            fontSize: textLayer.details?.fontSize || 16,
            isBold: textLayer.details?.isBold || false,
            isItalic: textLayer.details?.isItalic || false,
            isUnderlined: textLayer.details?.isUnderlined || false,
            projectId: projectId
        };
    }

    /**
     * Transform ImageLayer entity to CreateImageLayerRequest DTO
     */
    static toCreateImageLayerRequest(imageLayer: ImageLayer, projectId: string): CreateImageLayerRequest {
        return {
            imageUrl: imageLayer.imageUrl || '',
            width: imageLayer.details?.width?.toString() || '200',
            height: imageLayer.details?.height?.toString() || '200',
            projectId: projectId
        };
    }

    /**
     * Transform TextLayer entity to UpdateTextLayerDetailsRequest DTO
     */
    static toUpdateTextLayerDetailsRequest(textLayer: TextLayer): UpdateTextLayerDetailsRequest {
        return {
            text: textLayer.details?.text,
            fontColor: textLayer.details?.fontColor,
            fontFamily: textLayer.details?.fontFamily,
            fontSize: textLayer.details?.fontSize,
            isBold: textLayer.details?.isBold,
            isItalic: textLayer.details?.isItalic,
            isUnderlined: textLayer.details?.isUnderlined
        };
    }

    /**
     * Transform ImageLayer entity to UpdateImageLayerDetailsRequest DTO
     */
    static toUpdateImageLayerDetailsRequest(imageLayer: ImageLayer): UpdateImageLayerDetailsRequest {
        return {
            imageUrl: imageLayer.imageUrl,
            width: imageLayer.details?.width?.toString() || '200',
            height: imageLayer.details?.height?.toString() || '200'
        };
    }

    /**
     * Transform Layer entity to UpdateLayerCoordinatesRequest DTO
     */
    static toUpdateLayerCoordinatesRequest(layer: Layer): UpdateLayerCoordinatesRequest {
        return {
            x: layer.x,
            y: layer.y,
            z: layer.z
        };
    }

    // ==================== UTILITY METHODS ====================

    /**
     * Convert array of Project entities to ProjectResponse DTOs
     */
    static toProjectResponseArray(projects: Project[]): ProjectResponse[] {
        return projects.map(project => this.toProjectResponse(project));
    }

    /**
     * Convert array of ProjectResponse DTOs to Project entities
     */
    static toProjectEntityArray(responses: ProjectResponse[]): Project[] {
        return responses.map(response => this.toProjectEntity(response));
    }

    /**
     * Convert array of Layer entities to LayerResponse DTOs
     */
    static toLayerResponseArray(layers: Layer[]): LayerResponse[] {
        return layers.map(layer => this.toLayerResponse(layer));
    }

    /**
     * Convert array of LayerResponse DTOs to Layer entities
     */
    static toLayerEntityArray(responses: LayerResponse[]): Layer[] {
        return responses.map(response => this.toLayerEntity(response));
    }
}
