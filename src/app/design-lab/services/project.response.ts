
export interface ProjectResponse {
    id: string;
    user_id: string;
    name: string;
    preview_image_url: string;
    status: string;
    gender: string;
    garment_color: string;
    garment_size: string;
    last_modified: string;
    created_at: string;
    layers: LayerResponse[];
}

export interface LayerResponse {
    id: string;
    x: number;
    y: number;
    z_index: number;
    opacity: number;
    visible: boolean;
    type: string; // 'image' | 'text'
    image_url?: string;
    text_content?: string;
    font_size?: number;
    font_color?: string;
    font_family?: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
}
