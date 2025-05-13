import { Project } from '../model/project.entity';
import { CanvasAssembler } from './canvas.assembler';
import {
    ProjectResponse,
    ProjectStatus,
    GarmentSize,
} from './project.response';

export class ProjectAssembler {
    static ToEntityFromResponse(response: ProjectResponse): Project {
        return {
            id: response.id,
            userId: response.user_id,
            createdAt: new Date(response.created_at),
            status: response.status as ProjectStatus,
            previewImageUrl: response.preview_image_url,
            genre: response.genre,
            name: response.name,
            garmentColor: response.tshirt_color,
            garmentSize: response.tshirt_size as GarmentSize,
            lastModified: new Date(response.last_modified),
            canvas: CanvasAssembler.toEntityFromResponse(response.canvas),
        };
    }

    static ToEntitiesFromResponse(response: ProjectResponse[]): Project[] {
        return response.map((projectResponse) => {
            return ProjectAssembler.ToEntityFromResponse(projectResponse);
        });
    }
}