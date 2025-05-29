import { Project } from '../model/project.entity';
import { CanvasAssembler } from './canvas.assembler';
import {
    ProjectResponse,
    ProjectStatus,
    GarmentSize,
} from './project.response';

export class ProjectAssembler {
    static ToEntityFromResponse(response: any): Project {
        // Accept both camelCase and snake_case for robustness
        return {
            id: response.id,
            userId: response.userId || response.user_id,
            createdAt: response.createdAt ? new Date(response.createdAt) : (response.created_at ? new Date(response.created_at) : new Date()),
            status: response.status as ProjectStatus,
            previewImageUrl: response.previewImageUrl || response.preview_image_url || '',
            genre: response.genre,
            name: response.name,
            garmentColor: response.garmentColor || response.tshirt_color || response.garment_color || '',
            garmentSize: response.garmentSize || response.tshirt_size || response.garment_size || '',
            lastModified: response.lastModified ? new Date(response.lastModified) : (response.last_modified ? new Date(response.last_modified) : new Date()),
            canvas: CanvasAssembler.toEntityFromResponse(response.canvas),
        };
    }

    static ToEntitiesFromResponse(response: ProjectResponse[]): Project[] {
        return response.map((projectResponse) => {
            return ProjectAssembler.ToEntityFromResponse(projectResponse);
        });
    }
}