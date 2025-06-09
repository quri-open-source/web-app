import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { UserService } from '../../user-management/services/user.service';
import { ProjectAssembler } from './project.assembler';
import { ProjectResponse } from './project.response';
import { BaseService } from '../../shared/services/base.service';

// this must be removed when the backend is ready
const GET_ALL_USER_BLUEPRINTS = (id: string) =>
    `http://localhost:3000/projects?status=blueprint&user_id=${id}`;

const GET_USER_BLUEPRINT_BY_ID = (id: string, userId: string) =>
    `http://localhost:3000/projects?id=${id}&status=blueprint&user_id=${userId}`;

const GET_PROJECT_BY_ID = (id: string) =>
    `http://localhost:3000/projects?id=${id}`;

@Injectable({
    providedIn: 'root',
})
export class ProjectService extends BaseService<ProjectResponse> {
    protected userService = inject(UserService);

    constructor() {
        super('projects');
    }

    getUserBlueprints() {
        const userId = this.userService.getSessionUserId();
        return this.http
            .get<ProjectResponse[]>(GET_ALL_USER_BLUEPRINTS(userId))
            .pipe(
                map((projects) =>
                    ProjectAssembler.toEntitiesFromResponse(projects)
                )
            );
    }

    getUserBlueprintById(id: string) {
        return this.http
            .get<ProjectResponse>(GET_USER_BLUEPRINT_BY_ID(id, this.userService.getSessionUserId()))
            .pipe(
                map((project) =>
                    ProjectAssembler.toEntityFromResponse(project)
                )
            );
    }

    getProjectById(id: string) {
        return this.http
            .get<ProjectResponse[]>(GET_PROJECT_BY_ID(id))
            .pipe(
                map((projects) => {
                    if (projects && projects.length > 0) {
                        return ProjectAssembler.toEntityFromResponse(projects[0]);
                    }
                    throw new Error('Project not found');
                })
            );
    }
}
