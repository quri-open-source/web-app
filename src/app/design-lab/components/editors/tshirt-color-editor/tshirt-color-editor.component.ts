import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface GarmentColor {
  label: string;
  value: string;
}

@Component({
  selector: 'app-tshirt-color-editor',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatGridListModule, MatTooltipModule],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>T-Shirt Color</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <h4 class="section-title">Available Colors</h4>
        <mat-grid-list cols="4" rowHeight="50px">
          @for (color of garmentColors; track color.value) {
          <mat-grid-tile>
            <div
              class="color-swatch"
              [style.background-color]="color.value"
              [class.selected]="selectedColor === color.value"
              (click)="selectColor(color.value)"
              [matTooltip]="color.label"
            ></div>
          </mat-grid-tile>
          }
        </mat-grid-list>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      .color-swatch {
        width: 36px;
        height: 36px;
        border-radius: 4px;
        cursor: pointer;
        border: 2px solid transparent;
        transition: transform 0.2s, border-color 0.2s;
      }

      .color-swatch:hover {
        transform: scale(1.1);
      }

      .color-swatch.selected {
        border-color: #3f51b5;
        transform: scale(1.1);
      }

      .section-title {
        margin-top: 8px;
        margin-bottom: 16px;
        color: #333;
        font-weight: 500;
        font-size: 1rem;
        border-bottom: 1px solid #eee;
        padding-bottom: 4px;
      }
    `,
  ],
})
export class TshirtColorEditorComponent {
  @Input() selectedColor: string = '';
  @Output() colorSelected = new EventEmitter<string>();

  @Input() garmentColors: GarmentColor[] = [];

  selectColor(colorValue: string): void {
    this.colorSelected.emit(colorValue);
  }
}