import { GARMENT_COLOR, GARMENT_SIZE, PROJECT_GENDER, PROJECT_STATUS } from "../../const";
import { Project } from "../model/project.entity";
import { LayerAssembler } from "./layer.assembler";
import { ProjectResponse } from "./project.response";

export class ProjectAssembler {

    static toEntityFromResponse(response: ProjectResponse): Project {

        const layers = LayerAssembler.toEntitiesFromResponse(response.layers);

        return new Project(
            response.id,
            response.user_id,
            response.name,
            response.preview_image_url,
            response.status as PROJECT_STATUS,
            response.gender as PROJECT_GENDER,
            response.garment_color as GARMENT_COLOR,
            response.garment_size as GARMENT_SIZE,
            new Date(response.last_modified),
            new Date(response.created_at),
            layers
        );
    }

    static toEntitiesFromResponse(responses: ProjectResponse[]): Project[] {
        return responses.map(response => this.toEntityFromResponse(response));
    }
}
