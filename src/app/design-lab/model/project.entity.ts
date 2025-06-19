import {
    PROJECT_STATUS,
} from '../../const';
import { Layer } from './layer.entity';

export class Project {
    id: string;
    title: string;
    userId: string;
    previewUrl: string | null;
    status: PROJECT_STATUS;
    garmentColor: string;
    garmentSize: string;
    garmentGender: string;
    layers: Layer[];
    createdAt: Date;
    updatedAt: Date;

    constructor(
        id: string,
        title: string,
        userId: string,
        previewUrl: string | null,
        status: PROJECT_STATUS,
        garmentColor: string,
        garmentSize: string,
        garmentGender: string,
        layers: Layer[],
        createdAt: Date,
        updatedAt: Date
    ) {
        this.id = id;
        this.title = title;
        this.userId = userId;
        this.previewUrl = previewUrl;
        this.status = status;
        this.garmentColor = garmentColor;
        this.garmentSize = garmentSize;
        this.garmentGender = garmentGender;
        this.layers = layers;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
