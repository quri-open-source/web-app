import { ProjectStatus, GarmentSize } from "../services/project.response";
import { Canvas } from "./canvas.entity";
import { environment } from "../../../environments/environment";

function withDefault<T>(value: T | undefined | null | '', fallback: T): T {
    return value === undefined || value === null || value === '' ? fallback : value;
}

export class Project {
    id: string;
    userId: string;
    createdAt: Date;
    status: ProjectStatus;

    genre: string;
    previewImageUrl: string;
    name: string;
    garmentColor: string;
    garmentSize: GarmentSize;
    lastModified: Date;
    canvas: Canvas;


    constructor(
        userId: string,
        name: string,
        genre: string,
        garmentSize?: GarmentSize,
        color?: string,
        previewImageUrl?: string,
        lastModified?: Date,
        status?: ProjectStatus
    ) {
        this.id = crypto.randomUUID();
        this.userId = userId;
        this.createdAt = new Date();
        this.status = withDefault(status, environment.defaultProjectStatus as ProjectStatus);
        this.name = name;
        this.genre = genre;
        this.garmentSize = withDefault(garmentSize, environment.defaultGarmentSize as GarmentSize);
        this.garmentColor = withDefault(color, environment.defaultGarmentColor);
        this.previewImageUrl = withDefault(previewImageUrl, environment.defaultPreviewImageUrl);
        this.lastModified = lastModified ?? this.createdAt;
        this.canvas = new Canvas();
    }
}