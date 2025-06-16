import {Component, OnInit} from '@angular/core';
import { SearchBarComponent } from '../../../product-catalog/components/search-bar.component/search-bar.component';
import { ProductsViewComponent } from '../../../product-catalog/components/products-view.component/products-view.component';
import {Project} from '../../../design-lab/model/project.entity';
import {CommonModule} from '@angular/common';
import {ProjectService} from '../../../design-lab/services/project.service';
import {BehaviorSubject, combineLatest, map, Observable} from 'rxjs';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [SearchBarComponent,
    ProductsViewComponent, CommonModule],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.css'
})
export class ExploreComponent implements OnInit {
  projects: Project[] = [];
  filteredProjects: Project[] = [];

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.projectService.getAllPublicProjects().subscribe((projects) => {
      this.projects = projects;
      this.filteredProjects = [...this.projects];
    });
  }

  applyFilters(filters: { searchText: string; minPrice: number | null; maxPrice: number | null; selectedTags: string[] }): void {
    this.filteredProjects = this.projects.filter((project) => {
      const matchesText = filters.searchText
        ? project.name.toLowerCase().includes(filters.searchText.toLowerCase())
        : true;

      const matchesMinPrice = filters.minPrice != null ? project.price >= filters.minPrice : true;
      const matchesMaxPrice = filters.maxPrice != null ? project.price <= filters.maxPrice : true;

      const matchesTags = filters.selectedTags.length
        ? filters.selectedTags.every(tag => (project as any).tags?.includes(tag))
        : true;

      return matchesText && matchesMinPrice && matchesMaxPrice && matchesTags;
    });
  }
}
