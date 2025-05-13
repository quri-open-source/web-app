export type GarmentSize = 'S' | 'M' | 'L' | 'XL' | 'XXL';
export type ProjectStatus = 'blueprint' | 'garment-design';
export type LayerType = 'text' | 'image';
export type Genre = 'women' | 'men' | 'kid' | 'other';

export interface ProjectResponse {
    id: string;
    user_id: string;
    created_at: string;
    status: string;
    preview_image_url: string;
    name: string;
    genre: Genre;
    tshirt_color: string;
    tshirt_size: string;
    last_modified: string;
    canvas: CanvasResponse;
    layers: LayerResponse[];
}

export interface CanvasResponse {
    id: string;
    project_id: string;
    background_color: string;
    created_at: string;
    last_modified: string;
    layers: LayerResponse[];
}

export interface LayerResponse {
    id: string;
    canvas_id: string;
    type: LayerType;
    z_index: number;
    content: ContentResponse;
    is_visible: boolean;
    created_at: string;
    last_modified: string;
}

export interface ContentResponse {
    text?: string;
    x: number;
    y: number;
    font_family?: string;
    font_size?: number;
    font_weight?: number;
    color?: string;
    rotation: number;
    text_align?: string;
    opacity: number;
    image_url?: string;
    width?: number;
    height?: number;
    scale?: number;
    maintain_aspect_ratio?: boolean;
}