import { Component } from '@angular/core';
import { ProjectsViewComponent } from '../../../explorer/components/projects-view/projects-view.component';
import { SearchBarComponent } from '../../../explorer/components/search-bar/search-bar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [CommonModule, FormsModule, ProjectsViewComponent, SearchBarComponent],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.css'
})
export class ExploreComponent {
  searchText: string = '';

  onSearchChange(text: string) {
    this.searchText = text;
  }
}
