import { ProjectStatus, GarmentSize } from "../../design-lab/services/project.response";
import { Canvas } from "../../design-lab/model/canvas.entity";

export class ProjectEntity {
    id: string;
    user_id: string;
    name: string;
    genre: string;
    tshirt_color: string;
    project_privacy: string;
    price: number;
    likes: number;
    preview_image_url: string;

    status: ProjectStatus;
    created_at: Date;

    tshirt_size: GarmentSize;
    last_modified: Date;
    canvas: Canvas;

    constructor(
        user_id: string,
        name: string,
        genre: string,
        tshirt_size: GarmentSize,
        tshirt_color: string,
        project_privacy: string,
        price: number,
        likes: number,
        preview_image_url: string
    ) {
        this.id = crypto.randomUUID();
        this.user_id = user_id;
        this.created_at = new Date();
        this.status = 'blueprint';
        this.project_privacy = project_privacy;
        this.price = price;
        this.likes = likes;
        this.preview_image_url = preview_image_url;
        this.name = name;
        this.tshirt_color = tshirt_color;
        this.tshirt_size = tshirt_size;
        this.last_modified = new Date();
        this.genre = genre;
        this.canvas = new Canvas();
    }
}
