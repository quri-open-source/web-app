import { Project } from "../model/project.entity";

export class ProjectAssembler {
    static toEntityFromResponse(response: any): Project {
        const layers = response.layers || [];
        return new Project(
            response.id,
            response.title,
            response.userId,
            response.previewUrl,
            response.status,
            response.garmentColor,
            response.garmentSize,
            response.garmentGender,
            layers, // LayerAssembler puede adaptarse si es necesario
            new Date(response.createdAt),
            new Date(response.updatedAt)
        );
    }
    static toEntitiesFromResponse(responses: any[]): Project[] {
        return responses.map(response => this.toEntityFromResponse(response));
    }
}
