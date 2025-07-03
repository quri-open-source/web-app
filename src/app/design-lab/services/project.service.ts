import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { AuthenticationService } from '../../iam/services/authentication.service';
import { ProjectAssembler } from './project.assembler';
import { ProjectResponse } from './project.response';
import { Project } from '../model/project.entity';
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
export class ProjectService {
  private http = inject(HttpClient);
  private authService = inject(AuthenticationService);

  constructor() {
    console.log('🎨 ProjectService initialized with IAM integration');
  }

  private getCurrentUserId(): string | null {
    const userId = localStorage.getItem('userId');
    console.log('🔍 ProjectService - Current user ID from IAM:', userId);
    return userId;
  }

  getAllPublicProjects(): Observable<Project[]> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      throw new Error('No authenticated user found');
    }

    console.log('📡 Fetching all public projects for user:', userId);
    return this.http
      .get<ProjectResponse[]>(GET_ALL_BLUEPRINTS(userId))
      .pipe(
        map((projects: ProjectResponse[]) => {
          console.log('✅ Projects fetched successfully:', projects);
          return ProjectAssembler.toEntitiesFromResponse(projects);
        })
      );
  }

  getUserBlueprints(): Observable<Project[]> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      throw new Error('No authenticated user found');
    }

    console.log('📡 Fetching user blueprints for user:', userId);
    return this.http
      .get<ProjectResponse[]>(GET_ALL_USER_BLUEPRINTS(userId))
      .pipe(
        map((projects: ProjectResponse[]) => {
          console.log('✅ User blueprints fetched successfully:', projects);
          return ProjectAssembler.toEntitiesFromResponse(projects);
        })
      );
  }

  getUserBlueprintById(id: string): Observable<Project> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      throw new Error('No authenticated user found');
    }

    console.log('📡 Fetching user blueprint by ID:', id, 'for user:', userId);
    return this.http
      .get<ProjectResponse>(GET_USER_BLUEPRINT_BY_ID(id, userId))
      .pipe(
        map((project: ProjectResponse) => {
          console.log('✅ User blueprint fetched successfully:', project);
          return ProjectAssembler.toEntityFromResponse(project);
        })
      );
  }

  getProjectById(id: string): Observable<Project[]> {
    console.log('📡 Fetching project by ID:', id);
    return this.http
      .get<ProjectResponse[]>(GET_PROJECT_BY_ID(id))
      .pipe(
        map((projects: ProjectResponse[]) => {
          console.log('✅ Projects response:', projects);
          if (projects && projects.length > 0) {
            return ProjectAssembler.toEntitiesFromResponse(projects);
          }
          throw new Error('Project not found');
        })
      );
  }

  createProject(payload: {
    title: string;
    userId: string;
    garmentColor: string;
    garmentGender: string;
    garmentSize: string
  }): Observable<Project> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      throw new Error('No authenticated user found');
    }

    // Use the authenticated user ID instead of the payload userId
    const projectPayload = { ...payload, userId };
    const url = `${environment.apiBaseUrl}/projects/create`;

    console.log('📡 Creating project for user:', userId, 'with payload:', projectPayload);
    return this.http
      .post<ProjectResponse>(url, projectPayload)
      .pipe(
        map((response: ProjectResponse) => {
          console.log('✅ Project created successfully:', response);
          return ProjectAssembler.toEntityFromResponse(response);
        })
      );
  }

  getAllPublicProjectsForUser(): Observable<Project[]> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      throw new Error('No authenticated user found');
    }

    console.log('📡 Fetching all public projects for authenticated user:', userId);
    return this.http
      .get<ProjectResponse[]>(`${environment.apiBaseUrl}/projects/users/${userId}`)
      .pipe(
        map((projects: ProjectResponse[]) => {
          console.log('✅ Public projects fetched successfully:', projects);
          return ProjectAssembler.toEntitiesFromResponse(projects);
        })
      );
  }

  updateProject(id: string, projectData: ProjectResponse): Observable<Project> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      throw new Error('No authenticated user found');
    }

    const url = `${environment.apiBaseUrl}/projects/${id}`;
    console.log('📡 Updating project:', id, 'for user:', userId, 'with data:', projectData);

    return this.http
      .put<ProjectResponse>(url, projectData)
      .pipe(
        map((response: ProjectResponse) => {
          console.log('✅ Project updated successfully:', response);
          return ProjectAssembler.toEntityFromResponse(response);
        })
      );
  }
}
