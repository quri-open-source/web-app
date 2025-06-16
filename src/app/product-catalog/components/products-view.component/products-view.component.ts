import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../../design-lab/model/project.entity';
import { ProjectCardComponent } from '../../../access-security/components/project-card/project-card.component';

@Component({
  selector: 'app-products-view',
  standalone: true,
  imports: [
    CommonModule,
    ProjectCardComponent
  ],
  templateUrl: './products-view.component.html',
  styleUrls: ['./products-view.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsViewComponent {
  @Input() projects: Project[] = [];

  trackById(_: number, p: Project) {
    return p.id;
  }
}
