import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { UserService } from '../../user-management/services/user.service';
import { ProjectAssembler } from './project.assembler';
import { ProjectResponse } from './project.response';
import { BaseService } from '../../access-security/services/access.service';
import { environment } from '../../../environments/environment';

// TODO: this must be removed when the backend is ready
const GET_ALL_USER_BLUEPRINTS = (id: string) =>
  `${environment.apiBaseUrl}/projects/users/${id}`;

const GET_USER_BLUEPRINT_BY_ID = (id: string, userId: string) =>
  `${environment.apiBaseUrl}/projects/users/${userId}`;

const GET_PROJECT_BY_ID = (id: string) =>
  `${environment.apiBaseUrl}/projects/users/${id}`;

const GET_ALL_BLUEPRINTS = (userId: string) =>
  `${environment.apiBaseUrl}/projects/users/${userId}`;

@Injectable({
  providedIn: 'root',
})
export class ProjectService extends BaseService<ProjectResponse> {
  protected userService = inject(UserService);

  constructor() {
    super('projects');
  }

  getAllPublicProjects() {
    const userId = this.userService.getSessionUserId();

    return this.http
      .get<ProjectResponse[]>(GET_ALL_BLUEPRINTS(userId))
      .pipe(
        map((projects) => ProjectAssembler.toEntitiesFromResponse(projects))
      );
  }

  getUserBlueprints() {
    const userId = this.userService.getSessionUserId();
    return this.http
      .get<ProjectResponse[]>(GET_ALL_USER_BLUEPRINTS(userId))
      .pipe(
        map((projects) => ProjectAssembler.toEntitiesFromResponse(projects))
      );
  }

  getUserBlueprintById(id: string) {
    return this.http
      .get<ProjectResponse>(
        GET_USER_BLUEPRINT_BY_ID(id, this.userService.getSessionUserId())
      )
      .pipe(map((project) => ProjectAssembler.toEntityFromResponse(project)));
  }
  getProjectById(id: string) {
    return this.http.get<ProjectResponse[]>(GET_PROJECT_BY_ID(id)).pipe(
      map((projects) => {
        console.log('Projects response:', projects);
        if (projects && projects.length > 0) {
          return ProjectAssembler.toEntitiesFromResponse(projects);
        }
        throw new Error('Project not found');
      })
    );
  }

  // Method to create project and return Project entity
  createProject(payload: { title: string; userId: string; garmentColor: string; garmentGender: string; garmentSize: string }) {
    const url = `${environment.apiBaseUrl}/projects/create`;
    return this.http
      .post<any>(url, payload)
      .pipe(map((response) => {
        console.log('Project created response:', response);

        return ProjectAssembler.toEntityFromResponse(response)
      }));
  }

  getAllPublicProjectsForDevUser() {
    return this.http
      .get<ProjectResponse[]>(`${environment.apiBaseUrl}/projects/users/${environment.devUser}`)
      .pipe(map((projects) => ProjectAssembler.toEntitiesFromResponse(projects)));
  }
}
