import { Component, EventEmitter, Output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {
  searchText = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  availableTags: string[] = ['tag1', 'tag2', 'tag3']; // TODO: Cambiar por tags reales
  selectedTags: string[] = [];

  @Output() filtersChanged = new EventEmitter<{
    searchText: string;
    minPrice: number | null;
    maxPrice: number | null;
    selectedTags: string[];
  }>();

  emitFilters(): void {
    this.filtersChanged.emit({
      searchText: this.searchText,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      selectedTags: this.selectedTags,
    });
  }

  toggleTag(tag: string): void {
    if (this.selectedTags.includes(tag)) {
      this.selectedTags = this.selectedTags.filter((t) => t !== tag);
    } else {
      this.selectedTags.push(tag);
    }
    this.emitFilters();
  }
}
