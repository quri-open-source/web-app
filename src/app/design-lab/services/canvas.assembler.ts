import { Canvas } from "../model/canvas.entity";
import { LayerAssembler } from "./layer.assembler";
import { CanvasResponse } from "./project.response";

export class CanvasAssembler {
    static toEntityFromResponse(response: CanvasResponse): Canvas {
        return {
            id: response.id,
            projectId: response.project_id,
            backgroundColor: response.background_color,
            createdAt: new Date(response.created_at),
            lastModified: new Date(response.last_modified),
            layers: LayerAssembler.toEntitiesFromResponse(response.layers),
        };
    }
}