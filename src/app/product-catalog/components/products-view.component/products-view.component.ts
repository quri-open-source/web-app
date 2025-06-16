import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProjectCardComponent } from '../../../shared/components/project-card/project-card.component';
import { ProjectService } from '../../../design-lab/services/project.service';
import { Observable, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { Project } from '../../../design-lab/model/project.entity';

@Component({
  selector: 'app-products-view',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    ProjectCardComponent
  ],
  templateUrl: './products-view.component.html',
  styleUrls: ['./products-view.component.css'],
  providers: [ProjectService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsViewComponent {
  private projectService = inject(ProjectService);

  projects$: Observable<Project[]> = this.projectService
    .getAllPublicProjects()
    .pipe(
      map(list  => list.filter(p => p.privacy === 'public')),
      startWith([] as Project[]),
      catchError(() => of([] as Project[]))
    );

  trackById(_: number, p: Project) {
    return p.id;
  }
}
