import { GARMENT_COLOR, GARMENT_SIZE, PROJECT_GENDER } from '../../const';

// Project Requests
export interface CreateProjectRequest {
    title: string;
    userId: string;
    garmentColor: GARMENT_COLOR;
    garmentGender: PROJECT_GENDER;
    garmentSize: GARMENT_SIZE;
}

export interface UpdateProjectDetailsRequest {
    previewUrl?: string;
    status?: string;
    garmentColor?: string;
    garmentSize?: string;
    garmentGender?: string;
}

export interface UpdateProjectRequest {
    id: string;
    userId: string;
    title: string;
    previewUrl?: string;
    status: string;
    garmentColor: string;
    garmentSize: string;
    garmentGender: string;
    layers: any[];
    createdAt: string;
    updatedAt: string;
}

// Layer Requests
export interface CreateTextLayerRequest {
    text: string;
    fontColor: string;
    fontFamily: string;
    fontSize: number;
    isBold: boolean;
    isItalic: boolean;
    isUnderlined: boolean;
    projectId: string;
}

export interface CreateImageLayerRequest {
    imageUrl: string;
    width: string;
    height: string;
    projectId: string;
}

export interface UpdateTextLayerDetailsRequest {
    text?: string;
    fontColor?: string;
    fontFamily?: string;
    fontSize?: number;
    isBold?: boolean;
    isItalic?: boolean;
    isUnderlined?: boolean;
}

export interface UpdateImageLayerDetailsRequest {
    imageUrl?: string;
    width?: string;
    height?: string;
}

export interface UpdateLayerCoordinatesRequest {
    x: number;
    y: number;
    z: number;
}
