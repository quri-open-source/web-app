import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTooltipModule } from '@angular/material/tooltip';

interface GarmentColor {
  label: string;
  value: string;
}

@Component({
  selector: 'app-tshirt-color-editor',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatGridListModule, MatTooltipModule],
  templateUrl: './tshirt-color-editor.component.html',
  styleUrls: ['./tshirt-color-editor.component.css'],
})
export class TshirtColorEditorComponent {
  @Input() selectedColor: string = '';
  @Output() colorSelected = new EventEmitter<string>();

  // Garment colors configuration
  garmentColors: GarmentColor[] = [
    { label: 'black', value: '#161615' }, // row 0, col 0
    { label: 'gray', value: '#403D3B' }, // row 0, col 1
    { label: 'light-gray', value: '#B3B1AF' }, // row 0, col 2
    { label: 'white', value: '#EDEDED' }, // row 0, col 3
    { label: 'red', value: '#B51B14' }, // row 1, col 0
    { label: 'pink', value: '#F459B0' }, // row 1, col 1
    { label: 'light-purple', value: '#D890E4' }, // row 1, col 2
    { label: 'purple', value: '#693FA0' }, // row 1, col 3
    { label: 'light-blue', value: '#00A5BC' }, // row 2, col 0
    { label: 'cyan', value: '#31B7C9' }, // row 2, col 1
    { label: 'sky-blue', value: '#3F9BDC' }, // row 2, col 2
    { label: 'blue', value: '#1B3D92' }, // row 2, col 3
    { label: 'green', value: '#1B8937' }, // row 3, col 0
    { label: 'light-green', value: '#5BBE65' }, // row 3, col 1
    { label: 'yellow', value: '#FECD08' }, // row 3, col 2
    { label: 'dark-yellow', value: '#F2AB00' }, // row 3, col 3
  ];

  selectColor(colorValue: string): void {
    this.selectedColor = colorValue;
    // Convert string to GARMENT_COLOR enum value for event emission
    this.colorSelected.emit(colorValue as any);
  }

  getBackgroundPosition(colorValue: string): string {
    // Find the index of the color in the garmentColors array
    const colorIndex = this.garmentColors.findIndex(
      (color) => color.value === colorValue
    );

    if (colorIndex === -1) return '0% 0%'; // Default to first position if not found

    // Calculate row and column (0-3) based on the index
    const row = Math.floor(colorIndex / 4);
    const col = colorIndex % 4;

    // Each cell is 25% of the image width/height
    // Multiply by 100/3 to get percentage (33.33%)
    const xPos = col * (100 / 3);
    const yPos = row * (100 / 3);

    return `${xPos}% ${yPos}%`;
  }

  getSelectedColorLabel(): string {
    const selectedColorObj = this.garmentColors.find(
      color => color.value === this.selectedColor
    );
    return selectedColorObj ? selectedColorObj.label : '';
  }
}