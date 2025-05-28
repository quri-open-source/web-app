import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ProjectCardComponent } from '../project-card/project-card.component';
import { ProjectEntity } from '../../model/project.entity';
import { ProjectService } from '../../services/project.service';
import { CommonModule } from '@angular/common';
import { MatCommonModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-projects-view',
  standalone: true,
  imports: [
    CommonModule,
    MatCommonModule,
    MatButtonModule,
    MatIconModule,
    ProjectCardComponent
  ],
  templateUrl: './projects-view.component.html',
  styleUrl: './projects-view.component.css'
})
export class ProjectsViewComponent implements OnInit, OnChanges {
  @Input() searchText: string = '';
  projects: ProjectEntity[] = [];
  filteredProjects: ProjectEntity[] = [];
  error: string | null = null;

  constructor(private projectService: ProjectService) {}

  ngOnInit() {
    this.projectService.getPublicProjects().subscribe({
      next: (data: ProjectEntity[]) => {
        this.projects = data;
        this.applyFilter();
        this.error = null;
      },
      error: (err) => {
        this.error = 'Failed to load public projects. Please check your connection or try again later.';
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['searchText']) {
      this.applyFilter();
    }
  }

  applyFilter() {
    const text = this.searchText.trim().toLowerCase();
    if (!text) {
      this.filteredProjects = this.projects;
      return;
    }
    this.filteredProjects = this.projects.filter(project => {
      return Object.values(project).some(value => {
        if (typeof value === 'string') {
          return value.toLowerCase().includes(text);
        }
        if (typeof value === 'number') {
          return value.toString().includes(text);
        }
        return false;
      });
    });
  }
}