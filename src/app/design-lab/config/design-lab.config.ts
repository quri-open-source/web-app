/**
 * Design Lab Configuration
 * Defines constants, enums, and configuration for the Design Lab bounded context
 */

// ==================== API CONFIGURATION ====================
export const DESIGN_LAB_CONFIG = {
    API_BASE_URL: '/api/v1/projects',
    DEFAULT_LAYER_OPACITY: 1.0,
    DEFAULT_LAYER_VISIBILITY: true,
    DEFAULT_LAYER_POSITION: { x: 0, y: 0, z: 0 },
    DEFAULT_TEXT_PROPERTIES: {
        fontSize: 16,
        fontFamily: 'Arial',
        fontColor: '#000000',
        isBold: false,
        isItalic: false,
        isUnderlined: false
    },
    DEFAULT_IMAGE_PROPERTIES: {
        width: 200,
        height: 200
    },
    MAX_LAYERS_PER_PROJECT: 50,
    MAX_PROJECT_TITLE_LENGTH: 100,
    SUPPORTED_IMAGE_FORMATS: ['png', 'jpg', 'jpeg', 'gif', 'webp'],
    SUPPORTED_FONT_FAMILIES: [
        'Arial',
        'Helvetica',
        'Times New Roman',
        'Courier New',
        'Georgia',
        'Verdana',
        'Comic Sans MS',
        'Impact',
        'Trebuchet MS',
        'Arial Black'
    ]
};

// ==================== VALIDATION RULES ====================
export const DESIGN_LAB_VALIDATION = {
    PROJECT_TITLE: {
        MIN_LENGTH: 1,
        MAX_LENGTH: 100,
        REQUIRED: true
    },
    LAYER_TEXT: {
        MIN_LENGTH: 1,
        MAX_LENGTH: 500,
        REQUIRED: true
    },
    LAYER_COORDINATES: {
        MIN_X: -1000,
        MAX_X: 1000,
        MIN_Y: -1000,
        MAX_Y: 1000,
        MIN_Z: 0,
        MAX_Z: 100
    },
    LAYER_OPACITY: {
        MIN: 0.0,
        MAX: 1.0
    },
    FONT_SIZE: {
        MIN: 8,
        MAX: 72
    },
    IMAGE_DIMENSIONS: {
        MIN_WIDTH: 10,
        MAX_WIDTH: 1000,
        MIN_HEIGHT: 10,
        MAX_HEIGHT: 1000
    }
};

// ==================== ERROR MESSAGES ====================
export const DESIGN_LAB_ERROR_MESSAGES = {
    PROJECT_NOT_FOUND: 'Project not found',
    LAYER_NOT_FOUND: 'Layer not found',
    UNAUTHORIZED_ACCESS: 'You do not have permission to access this resource',
    INVALID_PROJECT_DATA: 'Invalid project data provided',
    INVALID_LAYER_DATA: 'Invalid layer data provided',
    LAYER_LIMIT_EXCEEDED: 'Maximum number of layers exceeded',
    INVALID_IMAGE_FORMAT: 'Invalid image format. Supported formats: PNG, JPG, JPEG, GIF, WEBP',
    INVALID_COORDINATES: 'Invalid layer coordinates',
    INVALID_OPACITY: 'Opacity must be between 0.0 and 1.0',
    INVALID_FONT_SIZE: 'Font size must be between 8 and 72',
    INVALID_DIMENSIONS: 'Invalid image dimensions',
    NETWORK_ERROR: 'Network error occurred. Please try again.',
    SERVER_ERROR: 'Server error occurred. Please try again later.'
};

// ==================== SUCCESS MESSAGES ====================
export const DESIGN_LAB_SUCCESS_MESSAGES = {
    PROJECT_CREATED: 'Project created successfully',
    PROJECT_UPDATED: 'Project updated successfully',
    PROJECT_DELETED: 'Project deleted successfully',
    LAYER_CREATED: 'Layer created successfully',
    LAYER_UPDATED: 'Layer updated successfully',
    LAYER_DELETED: 'Layer deleted successfully',
    COORDINATES_UPDATED: 'Layer coordinates updated successfully',
    DETAILS_UPDATED: 'Layer details updated successfully'
};

// ==================== UI CONSTANTS ====================
export const DESIGN_LAB_UI = {
    CANVAS_SIZE: {
        WIDTH: 400,
        HEIGHT: 400
    },
    LAYER_CONTROLS: {
        OPACITY_STEP: 0.1,
        POSITION_STEP: 1,
        Z_INDEX_STEP: 1
    },
    PREVIEW_MODES: {
        TSHIRT: 'tshirt',
        CANVAS: 'canvas',
        FULLSCREEN: 'fullscreen'
    },
    EDITOR_TOOLS: {
        TEXT: 'text',
        IMAGE: 'image',
        MOVE: 'move',
        SELECT: 'select'
    }
};

// ==================== LAYER TYPES ====================
export enum LayerType {
    TEXT = 'TEXT',
    IMAGE = 'IMAGE'
}

// ==================== PROJECT STATUS ====================
export enum ProjectStatus {
    BLUEPRINT = 'BLUEPRINT',
    GARMENT = 'GARMENT',
    TEMPLATE = 'TEMPLATE'
}

// ==================== COMMAND TYPES ====================
export enum CommandType {
    CREATE_PROJECT = 'CREATE_PROJECT',
    UPDATE_PROJECT = 'UPDATE_PROJECT',
    DELETE_PROJECT = 'DELETE_PROJECT',
    CREATE_TEXT_LAYER = 'CREATE_TEXT_LAYER',
    CREATE_IMAGE_LAYER = 'CREATE_IMAGE_LAYER',
    UPDATE_TEXT_LAYER = 'UPDATE_TEXT_LAYER',
    UPDATE_IMAGE_LAYER = 'UPDATE_IMAGE_LAYER',
    UPDATE_LAYER_COORDINATES = 'UPDATE_LAYER_COORDINATES',
    DELETE_LAYER = 'DELETE_LAYER'
}

// ==================== QUERY TYPES ====================
export enum QueryType {
    GET_PROJECTS_BY_USER = 'GET_PROJECTS_BY_USER',
    GET_PROJECT_BY_ID = 'GET_PROJECT_BY_ID',
    GET_PROJECT_DETAILS = 'GET_PROJECT_DETAILS',
    GET_LAYERS_BY_PROJECT = 'GET_LAYERS_BY_PROJECT',
    GET_LAYER_BY_ID = 'GET_LAYER_BY_ID'
}
