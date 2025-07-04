import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ProjectService } from '../../../design-lab/services/project.service';
import { Project } from '../../../design-lab/model/project.entity';
import { ProjectCardComponent } from '../../../design-lab/components/project-card/project-card.component';

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
        TranslateModule,
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
    private translate = inject(TranslateService);

    constructor() {}

    ngOnInit(): void {
        this.loadProjects();
    }

    loadProjects(): void {
        console.log('🔍 DesignLabComponent - Loading user projects...');
        this.loading = true;
        this.error = null;

        this.projectService.getUserBlueprints().subscribe({
            next: (projects) => {
                console.log('✅ DesignLabComponent - Projects loaded:', projects.length);
                this.projects = projects;
                this.loading = false;
            },
            error: (err) => {
                console.error('❌ DesignLabComponent - Error fetching projects:', err);
                console.error('❌ Error status:', err.status);
                console.error('❌ Error URL:', err.url);
                this.error = 'errors.failed_to_load_projects';
                this.loading = false;
            }
        });
    }

    onProjectDeleted(deletedProjectId: string): void {
        this.projects = this.projects.filter(
            (project) => project.id !== deletedProjectId
        );
        // add service to delete project from backend
    }
}
