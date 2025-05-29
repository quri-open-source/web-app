import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProjectService } from '../../../design-lab/services/project.service';
import { Project } from '../../../design-lab/model/project.entity';
import { ProjectCardComponent } from '../../../design-lab/components/project-card/project-card.component';

@Component({
  selector: 'app-design-lab',
  standalone: true,  imports: [
    CommonModule,
    HttpClientModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ProjectCardComponent,
    RouterLink
  ],
  templateUrl: './design-lab.component.html',
  styleUrl: './design-lab.component.css',
  providers: [ProjectService]
})
export class DesignLabComponent implements OnInit {
  projects: Project[] = [];
  loading = true;
  error: string | null = null;

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    // For demo purposes, using a hardcoded user ID
    // In a real app, you would get this from an auth service
    const userId = 'user-001';
    console.log(this.projectService.getURL());

    this.projectService.getAllById(userId).subscribe({
      next: (projects) => {
        this.projects = projects;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching projects:', err);
        this.error = 'Failed to load projects. Please try again later.';
        this.loading = false;
      }
    });
  }

  onProjectDeleted(deletedProjectId: string): void {
    this.projects = this.projects.filter(project => project.id !== deletedProjectId);
  }
}
