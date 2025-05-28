import { Component, Input } from '@angular/core';
import { ProjectEntity } from '../../model/project.entity';
import { ProjectService } from '../../services/project.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-project-card',
  imports: [MatButtonModule, MatIconModule, MatCardModule],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.css'
})
export class ProjectCardComponent {
  @Input() project!: ProjectEntity;
}
