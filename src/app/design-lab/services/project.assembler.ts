import { Project } from '../model/project.entity';
import { CanvasAssembler } from './canvas.assembler';
import {
    ProjectResponse,
    ProjectStatus,
    GarmentSize,
} from './project.response';
import { Canvas } from '../model/canvas.entity';

export class ProjectAssembler {
    static ToEntityFromResponse(response: any): Project {
        // Normaliza todos los campos a camelCase y asegura tipos correctos
        const id = response.id;
        const userId = response.user_id || response.userId || '';
        const createdAtRaw = response.created_at || response.createdAt;
        const createdAt = createdAtRaw ? new Date(createdAtRaw) : new Date();
        const status = response.status;
        const previewImageUrl = response.preview_image_url || response.previewImageUrl || '';
        const genre = response.genre || '';
        const name = response.name || '';
        const garmentColor = response.tshirt_color || response.garmentColor || '';
        const garmentSize = response.tshirt_size || response.garmentSize || '';
        const lastModifiedRaw = response.last_modified || response.lastModified;
        const lastModified = lastModifiedRaw ? new Date(lastModifiedRaw) : createdAt;
        const canvas = response.canvas ? CanvasAssembler.toEntityFromResponse(response.canvas) : new Canvas();

        // Usa el constructor para garantizar defaults y consistencia
        const project = new Project(
            userId,
            name,
            genre,
            garmentSize,
            garmentColor,
            previewImageUrl,
            lastModified,
            status
        );
        project.id = id;
        project.createdAt = createdAt;
        project.canvas = canvas;
        return project;
    }

    static ToEntitiesFromResponse(response: ProjectResponse[]): Project[] {
        return response.map((projectResponse) => {
            return ProjectAssembler.ToEntityFromResponse(projectResponse);
        });
    }
}