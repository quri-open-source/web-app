import { ProjectStatus, GarmentSize } from "../services/project.response";
import { Canvas } from "./canvas.entity";

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


    constructor(userId: string, name: string, genre: string, garmentSize: GarmentSize, color: string) {
        this.id = crypto.randomUUID();
        this.userId = userId;
        this.createdAt = new Date();
        this.status = 'blueprint';
        this.previewImageUrl = '';
        this.name = name;
        this.garmentColor = color;
        this.garmentSize = garmentSize;
        this.genre = genre;
        this.lastModified = new Date();
        this.canvas = new Canvas();
    }
}