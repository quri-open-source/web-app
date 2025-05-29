import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../../../design-lab/model/project.entity';
import { ProjectCardComponent } from '../../../../design-lab/components/project-card/project-card.component';

@Component({
  selector: 'app-project-cards',
  standalone: true,
  imports: [CommonModule, ProjectCardComponent],
  template: `
    <div class="projects-grid">
      @for (project of projects; track project.id) {
        <app-project-card [project]="project"></app-project-card>
      }
    </div>
  `
})
export class ProjectCardsComponent {
  @Input() projects: Project[] = [];
}
