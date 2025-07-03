import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../model/project.entity';

@Component({
  selector: 'app-project-preview',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
  ],
  templateUrl: './project-preview.component.html',
  styleUrl: './project-preview.component.css',
})
export class ProjectPreviewComponent implements OnInit {
    private projectService = inject(ProjectService);
    private route = inject(ActivatedRoute);

    project: Project | null = null;
    loading = true;
    error: string | null = null;

    ngOnInit(): void {
        console.log('ProjectPreview: Starting to load project data...');
        const projectId = this.route.snapshot.paramMap.get('id');

        if (projectId) {
            console.log('Project ID from route:', projectId);
            this.loadProject(projectId);
        } else {
            this.error = 'No project ID provided';
            this.loading = false;
        }
    }

    private loadProject(projectId: string): void {
      console.log('Loading project with ID:', projectId);
        this.projectService.getAllPublicProjectsForUser().subscribe({
            next: (projects: Project[]) => {
                console.log('Project loaded:', projects);

                const project = projects.find((p: Project) => p.id === projectId);
                if (!project) {
                    this.error = 'Project not found';
                    this.loading = false;
                    return;
                }

                this.project = project;
                this.loading = false;
            },
            error: (err: any) => {
                console.error('Error loading project:', err);
                this.error = 'Failed to load project';
                this.loading = false;
            }
        });
    }
}
