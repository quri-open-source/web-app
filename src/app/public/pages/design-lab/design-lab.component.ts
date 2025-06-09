import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProjectService } from '../../../design-lab/services/project.service';
import { Project } from '../../../design-lab/model/project.entity';
import { ProjectCardComponent } from '../../../design-lab/components/project-card.component/project-card.component';

@Component({
    selector: 'app-design-lab',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        ProjectCardComponent,
        RouterLink,
    ],
    templateUrl: './design-lab.component.html',
    styleUrl: './design-lab.component.css',
    providers: [ProjectService],
})
export class DesignLabComponent implements OnInit {
    projects: Project[] = [];
    loading = true;
    error: string | null = null;
    protected projectService = inject(ProjectService);

    constructor() {}

    ngOnInit(): void {
        this.loadProjects();
    }

    loadProjects(): void {
        this.projectService.getUserBlueprints().subscribe(
            (projects) => {
                this.projects = projects;
                this.loading = false;
            },
            (err) => {
                console.error('Error fetching projects:', err);
                this.error = 'Failed to load projects. Please try again later.';
                this.loading = false;
            }
        );
    }

    onProjectDeleted(deletedProjectId: string): void {
        this.projects = this.projects.filter(
            (project) => project.id !== deletedProjectId
        );
        // add service to delete project from backend
    }
}
