import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { AuthenticationService } from '../../iam/services/authentication.service';
import { ProjectAssembler } from './project.assembler';
import { ProjectResponse } from './project.response';
import { CreateProjectRequest } from './project.request';
import { Project } from '../model/project.entity';
import { environment } from '../../../environments/environment';

// API Endpoints
const GET_ALL_USER_PROJECTS = (userId: string) =>
  `${environment.serverBaseUrl}/projects/users/${userId}`;

const GET_PROJECT_BY_ID = (id: string) =>
  `${environment.serverBaseUrl}/projects/${id}`;

const CREATE_PROJECT_URL = `${environment.serverBaseUrl}/projects`;

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
    const token = localStorage.getItem('token');
    console.log('🔍 ProjectService - Current user ID from IAM:', userId);
    console.log('🔑 ProjectService - Auth token present:', !!token);
    if (token) {
      console.log('🔑 Token preview:', token.substring(0, 20) + '...');
    }
    return userId;
  }

  getAllPublicProjects(): Observable<Project[]> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      throw new Error('No authenticated user found');
    }

    console.log('📡 Fetching all public projects for user:', userId);
    return this.http
      .get<ProjectResponse[]>(GET_ALL_USER_PROJECTS(userId))
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
      .get<ProjectResponse[]>(GET_ALL_USER_PROJECTS(userId))
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
      .get<ProjectResponse>(GET_PROJECT_BY_ID(id))
      .pipe(
        map((project: ProjectResponse) => {
          console.log('✅ User blueprint fetched successfully:', project);
          return ProjectAssembler.toEntityFromResponse(project);
        })
      );
  }

  getProjectById(id: string): Observable<Project> {
    console.log('📡 Fetching project by ID:', id);
    return this.http
      .get<ProjectResponse>(GET_PROJECT_BY_ID(id))
      .pipe(
        map((project: ProjectResponse) => {
          console.log('✅ Project response:', project);
          return ProjectAssembler.toEntityFromResponse(project);
        })
      );
  }

  createProject(request: CreateProjectRequest): Observable<Project> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      throw new Error('No authenticated user found');
    }

    // Use the authenticated user ID
    const projectPayload = { ...request, userId };

    console.log('📡 Creating project for user:', userId, 'with payload:', projectPayload);
    console.log('🌐 POST URL:', CREATE_PROJECT_URL);
    
    return this.http
      .post<ProjectResponse>(CREATE_PROJECT_URL, projectPayload)
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
      .get<ProjectResponse[]>(GET_ALL_USER_PROJECTS(userId))
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

    const url = `${environment.serverBaseUrl}/projects/${id}`;
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
