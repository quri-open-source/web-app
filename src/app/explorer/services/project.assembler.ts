import { CanvasAssembler } from "../../design-lab/services/canvas.assembler";
import { GarmentSize, ProjectResponse, ProjectStatus } from "../../design-lab/services/project.response";
import { ProjectEntity } from "../model/project.entity";

export class ProjectAssembler {
    static ToEntityFromResponse(response: ProjectResponse): ProjectEntity {
        return {
            id: response.id,
            user_id: response.user_id,
            name: response.name,
            genre: response.genre,
            tshirt_size: response.tshirt_size as GarmentSize,
            tshirt_color: response.tshirt_color,
            project_privacy: response.project_privacy,
            price: response.price,
            likes: response.likes,
            preview_image_url: response.preview_image_url,
            status: response.status as ProjectStatus,
            created_at: new Date(response.created_at),
            last_modified: new Date(response.last_modified),
            canvas: CanvasAssembler.toEntityFromResponse(response.canvas),
        };
    }
}
