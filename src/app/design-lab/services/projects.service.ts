import { Injectable } from '@angular/core';
import { ProjectService } from './project.service';
import { Project } from '../model/project.entity';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProjectsPageService {
  constructor(private projectService: ProjectService) {}

  getAllProjects(userId: string): Observable<Project[]> {
    return this.projectService.getAllById(userId);
  }
}
