import { Project } from "../model/project.entity";
import { ProjectResponse } from "./project.response";
import { PROJECT_STATUS, PROJECT_GENDER, GARMENT_COLOR, GARMENT_SIZE } from "../../const";
import { LayerAssembler } from "./layer.assembler";

export class ProjectAssembler {
    static toEntityFromResponse(response: ProjectResponse): Project {
        const layers = response.layers ? LayerAssembler.toEntitiesFromResponse(response.layers) : [];
        return new Project(
            response.id,
            response.title,
            response.user_id,
            response.preview_url,
            response.status as PROJECT_STATUS,
            response.garment_color as GARMENT_COLOR,
            response.garment_size as GARMENT_SIZE,
            response.garment_gender as PROJECT_GENDER,
            layers,
            new Date(response.created_at),
            new Date(response.updated_at)
        );
    }
    
    static toEntitiesFromResponse(responses: ProjectResponse[]): Project[] {
        return responses.map(response => this.toEntityFromResponse(response));
    }
}
