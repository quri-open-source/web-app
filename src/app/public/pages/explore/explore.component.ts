import { Component } from '@angular/core';
import { ProjectsViewComponent } from '../../../explorer/components/projects-view/projects-view.component';
import { SearchBarComponent } from '../../../explorer/components/search-bar/search-bar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [CommonModule, ProjectsViewComponent, SearchBarComponent],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.css'
})
export class ExploreComponent {

}
