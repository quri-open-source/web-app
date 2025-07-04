/**
 * Design Lab - Layer Commands
 * Following CQRS pattern - Commands for write operations
 */

// ==================== LAYER COMMANDS ====================

export interface CreateTextLayerCommand {
    projectId: string;
    text: string;
    fontColor: string;
    fontFamily: string;
    fontSize: number;
    isBold: boolean;
    isItalic: boolean;
    isUnderlined: boolean;
    x?: number;
    y?: number;
    z?: number;
}

export interface CreateImageLayerCommand {
    projectId: string;
    imageUrl: string;
    width: string;
    height: string;
    x?: number;
    y?: number;
    z?: number;
}

export interface UpdateTextLayerDetailsCommand {
    projectId: string;
    layerId: string;
    text?: string;
    fontColor?: string;
    fontFamily?: string;
    fontSize?: number;
    isBold?: boolean;
    isItalic?: boolean;
    isUnderlined?: boolean;
}

export interface UpdateImageLayerDetailsCommand {
    projectId: string;
    layerId: string;
    imageUrl?: string;
    width?: string;
    height?: string;
}

export interface UpdateLayerCoordinatesCommand {
    projectId: string;
    layerId: string;
    x: number;
    y: number;
    z: number;
}

export interface DeleteLayerCommand {
    projectId: string;
    layerId: string;
    userId: string; // For authorization
}

export interface UpdateLayerVisibilityCommand {
    projectId: string;
    layerId: string;
    isVisible: boolean;
}

export interface UpdateLayerOpacityCommand {
    projectId: string;
    layerId: string;
    opacity: number;
}

// ==================== COMMAND RESULTS ====================

export interface LayerCommandResult {
    success: boolean;
    layerId?: string;
    projectId?: string;
    message?: string;
    error?: string;
}
