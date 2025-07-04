import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { GARMENT_COLOR } from '../../../../const';

interface GarmentColorOption {
  label: string;
  value: GARMENT_COLOR;
  hexValue: string;
}

@Component({
  selector: 'app-tshirt-color-editor',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatGridListModule, MatTooltipModule, TranslateModule],
  templateUrl: './tshirt-color-editor.component.html',
  styleUrls: ['./tshirt-color-editor.component.css'],
})

export class TshirtColorEditorComponent {
  @Input() selectedColor: GARMENT_COLOR | null = null;
  @Output() colorSelected = new EventEmitter<GARMENT_COLOR>();

  constructor(private translate: TranslateService) {}

  garmentColors: GarmentColorOption[] = [
    { label: 'black', value: GARMENT_COLOR.BLACK, hexValue: '#161615' },
    { label: 'gray', value: GARMENT_COLOR.GRAY, hexValue: '#403D3B' },
    { label: 'light-gray', value: GARMENT_COLOR.LIGHT_GRAY, hexValue: '#B3B1AF' },
    { label: 'white', value: GARMENT_COLOR.WHITE, hexValue: '#EDEDED' },
    { label: 'red', value: GARMENT_COLOR.RED, hexValue: '#B51B14' },
    { label: 'pink', value: GARMENT_COLOR.PINK, hexValue: '#F459B0' },
    { label: 'light-purple', value: GARMENT_COLOR.LIGHT_PURPLE, hexValue: '#D890E4' },
    { label: 'purple', value: GARMENT_COLOR.PURPLE, hexValue: '#693FA0' },
    { label: 'light-blue', value: GARMENT_COLOR.LIGHT_BLUE, hexValue: '#00A5BC' },
    { label: 'cyan', value: GARMENT_COLOR.CYAN, hexValue: '#31B7C9' },
    { label: 'sky-blue', value: GARMENT_COLOR.SKY_BLUE, hexValue: '#3F9BDC' },
    { label: 'blue', value: GARMENT_COLOR.BLUE, hexValue: '#1B3D92' },
    { label: 'green', value: GARMENT_COLOR.GREEN, hexValue: '#1B8937' },
    { label: 'light-green', value: GARMENT_COLOR.LIGHT_GREEN, hexValue: '#5BBE65' },
    { label: 'yellow', value: GARMENT_COLOR.YELLOW, hexValue: '#FECD08' },
    { label: 'dark-yellow', value: GARMENT_COLOR.DARK_YELLOW, hexValue: '#F2AB00' },
  ];

  selectColor(colorValue: GARMENT_COLOR): void {
    this.selectedColor = colorValue;
    this.colorSelected.emit(colorValue);
  }

  getColorHexValue(colorValue: GARMENT_COLOR): string {
    const colorOption = this.garmentColors.find(color => color.value === colorValue);
    return colorOption ? colorOption.hexValue : '#000000';
  }
  getBackgroundPosition(colorValue: GARMENT_COLOR): string {
    // Find the index of the color in the garment-colors array
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
    if (!this.selectedColor) return '';
    const selectedColorObj = this.garmentColors.find(
      color => color.value === this.selectedColor
    );
    return selectedColorObj ? this.translate.instant(`design.${selectedColorObj.label}`) : '';
  }

  isColorSelected(colorValue: GARMENT_COLOR): boolean {
    return this.selectedColor === colorValue;
  }
}
