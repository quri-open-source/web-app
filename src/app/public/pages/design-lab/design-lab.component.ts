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
import { UserService } from '../../../shared/services/user.service';
import { User } from '../../../core/model/user.entity';

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
  user: User | null = null;

  constructor(private projectService: ProjectService, private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.user = user;
        this.loadProjects();
      },
      error: (err) => {
        this.error = 'Failed to load user.';
        this.loading = false;
      }
    });
  }

  loadProjects(): void {
    if (!this.user) return;
    this.projectService.getAllById(this.user.id).subscribe({
      next: (projects: any[]) => {
        // Normaliza todos los campos relevantes a camelCase para robustez
        this.projects = projects.map(p => ({
          ...p,
          id: p.id,
          userId: p.userId || p.user_id,
          createdAt: p.createdAt ? new Date(p.createdAt) : (p.created_at ? new Date(p.created_at) : new Date()),
          lastModified: p.lastModified ? new Date(p.lastModified) : (p.last_modified ? new Date(p.last_modified) : new Date()),
          status: p.status,
          name: p.name,
          genre: p.genre,
          previewImageUrl: p.previewImageUrl || p.preview_image_url || '',
          garmentColor: p.garmentColor || p.tshirt_color || p.garment_color || '',
          garmentSize: p.garmentSize || p.tshirt_size || p.garment_size || '',
          projectPrivacy: p.projectPrivacy || p.project_privacy || '',
          price: p.price,
          likes: p.likes,
          canvas: p.canvas
        }));
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching projects:', err);
        this.error = 'Failed to load projects. Please try again later.';
        this.loading = false;
      }
    });
  }
}
