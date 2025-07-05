/**
 * Design Lab - Queries
 * Following CQRS pattern - Queries for read operations
 */

// ==================== PROJECT QUERIES ====================

export interface GetAllProjectsByUserIdQuery {
    userId: string;
}

export interface GetProjectByIdQuery {
    projectId: string;
}

export interface GetProjectDetailsForProductQuery {
    projectId: string;
}

export interface GetProjectsByStatusQuery {
    userId: string;
    status: string;
}

export interface GetProjectsByGarmentColorQuery {
    userId: string;
    garmentColor: string;
}

// ==================== LAYER QUERIES ====================

export interface GetLayerByIdQuery {
    layerId: string;
    projectId: string;
}

export interface GetLayersByProjectIdQuery {
    projectId: string;
}

export interface GetLayersByTypeQuery {
    projectId: string;
    type: 'TEXT' | 'IMAGE';
}

export interface GetVisibleLayersQuery {
    projectId: string;
    isVisible: boolean;
}

// ==================== QUERY RESULTS ====================

export interface ProjectQueryResult {
    success: boolean;
    data?: any;
    message?: string;
    error?: string;
}

export interface LayerQueryResult {
    success: boolean;
    data?: any;
    message?: string;
    error?: string;
}
