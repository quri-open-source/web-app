import { Component, OnInit } from '@angular/core';
import { ProjectCardComponent } from '../project-card/project-card.component';
import { ProjectEntity } from '../../model/project.entity';
import { ProjectService } from '../../services/project.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-projects-view',
  imports: [CommonModule, ProjectCardComponent],
  templateUrl: './projects-view.component.html',
  styleUrl: './projects-view.component.css'
})
export class ProjectsViewComponent implements OnInit {
  projects: ProjectEntity[] = [];

  constructor(private projectService: ProjectService) {}

  ngOnInit() {
    this.projectService.getPublicProjects().subscribe((data: ProjectEntity[]) => {
      this.projects = data;
    });
  }
}