import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { Project } from '../model/project.entity';
import { map, Observable } from 'rxjs';
import { ProjectAssembler } from './project.assembler';
import { ProjectResponse } from './project.response';

@Injectable({
  providedIn: 'root',
})
export class ProjectService extends BaseService<Project> {
  constructor() {
    super('/projects');
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
}