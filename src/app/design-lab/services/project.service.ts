
import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { Project } from '../model/project.entity';
import { map, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ProjectAssembler } from './project.assembler';
import { ProjectResponse } from './project.response';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProjectService extends BaseService<Project> {

  constructor() {
    super('/projects');
  }

  /**
   * Get all available garment sizes from backend (db.json)
   */
  public getAllGarmentSizes(): Observable<{ label: string, value: string }[]> {
    return this.http.get<any[]>(`${environment.apiBaseUrl}/garmentSizes`).pipe(
      map((sizes: any[]) => Array.isArray(sizes) ? sizes.map(({ label, value }) => ({ label, value })) : []),
      catchError(err => {
        console.error('Error in getAllGarmentSizes', err);
        return of([]);
      })
    );
  }

  /**
   * Get all available project status options from backend (db.json)
   */
  public getAllProjectStatus(): Observable<{ label: string, value: string }[]> {
    return this.http.get<any[]>(`${environment.apiBaseUrl}/projectStatus`).pipe(
      map((statuses: any[]) => Array.isArray(statuses) ? statuses.map(({ label, value }) => ({ label, value })) : []),
      catchError(err => {
        console.error('Error in getAllProjectStatus', err);
        return of([]);
      })
    );
  }

  public getAllById(id: string): Observable<Project[]> {
    return this.http
      .get<ProjectResponse[]>(`${this.resourcePath()}`, {
        params: {
          user_id: id,
        },
      })
      .pipe(
        map((response) => {
          return ProjectAssembler.ToEntitiesFromResponse(response);
        })
      );
  }

  public createProject(project: Project): Observable<Project> {
    return this.create(project).pipe(
      map((response: any) => {
        return ProjectAssembler.ToEntityFromResponse(response);
      })
    );
  }

  /**
   * Get all available garment colors from backend (db.json)
   */
  public getAllGarmentColors(): Observable<{ label: string, value: string }[]> {
    return this.http.get<any[]>(`${environment.apiBaseUrl}/garmentColors`).pipe(
      map(colors => Array.isArray(colors) ? colors.map(({ label, value }) => ({ label, value })) : []),
      catchError(err => {
        console.error('Error in getAllGarmentColors', err);
        return of([]);
      })
    );
  }

  /**
   * Get all available genres from backend (db.json)
   */
  public getAllGenres(): Observable<{ label: string, value: string }[]> {
    return this.http.get<any[]>(`${environment.apiBaseUrl}/genres`).pipe(
      map(genres => Array.isArray(genres) ? genres.map(({ label, value }) => ({ label, value })) : []),
      catchError(err => {
        console.error('Error in getAllGenres', err);
        return of([]);
      })
    );
  }
}