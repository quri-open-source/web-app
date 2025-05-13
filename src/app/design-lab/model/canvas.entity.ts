import { Layer } from "./layer.entity";

export class Canvas {
    id: string;
    projectId: string;
    backgroundColor: string;
    createdAt: Date;
    lastModified: Date;

    layers: Layer[];

    constructor() {
        this.id = '';
        this.projectId = '';
        this.backgroundColor = '';
        this.createdAt = new Date();
        this.lastModified = new Date();
        this.layers = [];
    }
}