// Design Lab - Response DTOs

// Layer Response
export interface LayerResponse {
    id: string;
    x: number;
    y: number;
    z: number;
    opacity: number;
    isVisible: boolean;
    type: 'TEXT' | 'IMAGE';
    createdAt: string;
    updatedAt: string;
    details?: {
        // Text Layer Details
        text?: string;
        fontColor?: string;
        fontFamily?: string;
        fontSize?: number;
        isBold?: boolean;
        isItalic?: boolean;
        isUnderlined?: boolean;
        
        // Image Layer Details
        imageUrl?: string;
        width?: number;
        height?: number;
    };
}

// Text Layer Specific Response
export interface TextLayerResponse extends LayerResponse {
    type: 'TEXT';
    details: {
        text: string;
        fontColor: string;
        fontFamily: string;
        fontSize: number;
        isBold: boolean;
        isItalic: boolean;
        isUnderlined: boolean;
    };
}

// Image Layer Specific Response
export interface ImageLayerResponse extends LayerResponse {
    type: 'IMAGE';
    details: {
        imageUrl: string;
        width: number;
        height: number;
    };
}

// Project Response
export interface ProjectResponse {
    id: string;
    title: string;
    userId: string;
    previewUrl?: string;
    status: string;
    garmentColor: string;
    garmentSize: string;
    garmentGender: string;
    layers: LayerResponse[];
    createdAt: string;
    updatedAt: string;
}

// Project Details Response (for Product Catalog integration)
export interface ProjectDetailsResponse {
    id: string;
    title: string;
    previewUrl?: string;
    userId: string;
}

// Layer Operation Response
export interface LayerOperationResponse {
    id: string;
    message: string;
    layerId?: string;
    projectId?: string;
}

// Delete Layer Response
export interface DeleteLayerResponse {
    message: string;
    layerId: string;
    projectId: string;
}

// Delete Project Response
export interface DeleteProjectResponse {
    message: string;
    projectId: string;
}

// Error Response
export interface ErrorResponse {
    error: string;
    message: string;
    details?: any;
}
