import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProjectEntity } from '../model/project.entity';
import { ProjectAssembler } from './project.assembler';
import { ProjectResponse } from '../../design-lab/services/project.response';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = 'http://localhost:3000/projects'; 

  constructor(private http: HttpClient) { }

  getPublicProjects(): Observable<ProjectEntity[]> {
    return this.http.get<ProjectResponse[]>(this.apiUrl).pipe(
      map(projects => projects
        .filter(p => p.project_privacy === 'public')
        .map(ProjectAssembler.ToEntityFromResponse)
      )
    );
  }
}
