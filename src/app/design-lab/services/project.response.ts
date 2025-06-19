export interface ProjectResponse {
    id: string;
    title: string;
    user_id: string;
    preview_url: string | null;
    status: string;
    garment_color: number;
    garment_size: string;
    garment_gender: string;
    layers: LayerResponse[];
    created_at: string;
    updated_at: string;
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
