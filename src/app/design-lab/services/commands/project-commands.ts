/**
 * Design Lab - Project Commands
 * Following CQRS pattern - Commands for write operations
 */

import { GARMENT_COLOR, GARMENT_SIZE, PROJECT_GENDER } from '../../../const';

// ==================== PROJECT COMMANDS ====================

export interface CreateProjectCommand {
    title: string;
    userId: string;
    garmentColor: GARMENT_COLOR;
    garmentGender: PROJECT_GENDER;
    garmentSize: GARMENT_SIZE;
}

export interface UpdateProjectCommand {
    id: string;
    title?: string;
    previewUrl?: string;
    status?: string;
    garmentColor?: GARMENT_COLOR;
    garmentSize?: GARMENT_SIZE;
    garmentGender?: PROJECT_GENDER;
}

export interface DeleteProjectCommand {
    projectId: string;
    userId: string; // For authorization
}

export interface UpdateProjectDetailsCommand {
    projectId: string;
    previewUrl?: string;
    status?: string;
    garmentColor?: string;
    garmentSize?: string;
    garmentGender?: string;
}

// ==================== COMMAND RESULTS ====================

export interface ProjectCommandResult {
    success: boolean;
    projectId?: string;
    message?: string;
    error?: string;
}
