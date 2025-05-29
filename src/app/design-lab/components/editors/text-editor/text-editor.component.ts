import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

export interface TextProperties {
  text: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  color: string;
  textAlign: 'left' | 'center' | 'right';
  italic?: boolean;
  underline?: boolean;
}

@Component({
  selector: 'app-text-editor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatButtonToggleModule,
    MatIconModule,
    MatSliderModule,
    MatSelectModule,
    MatTooltipModule,
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Add Text</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div class="text-editor-container">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Text</mat-label>
            <input
              matInput
              [(ngModel)]="textProps.text"
              (ngModelChange)="textChanged()"
              placeholder="Enter your text"
            />
          </mat-form-field>

          <h4 class="section-title">Font Settings</h4>
          <div class="text-format-section">
            <mat-form-field appearance="outline">
              <mat-label>Font</mat-label>
              <mat-select
                [(ngModel)]="textProps.fontFamily"
                (ngModelChange)="textChanged()"
              >
                <mat-option value="Arial">Arial</mat-option>
                <mat-option value="Helvetica">Helvetica</mat-option>
                <mat-option value="Times New Roman">Times New Roman</mat-option>
                <mat-option value="Courier New">Courier New</mat-option>
                <mat-option value="Verdana">Verdana</mat-option>
                <mat-option value="Georgia">Georgia</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Size</mat-label>
              <mat-select
                [(ngModel)]="textProps.fontSize"
                (ngModelChange)="textChanged()"
              >
                <mat-option [value]="12">12</mat-option>
                <mat-option [value]="14">14</mat-option>
                <mat-option [value]="16">16</mat-option>
                <mat-option [value]="18">18</mat-option>
                <mat-option [value]="20">20</mat-option>
                <mat-option [value]="24">24</mat-option>
                <mat-option [value]="28">28</mat-option>
                <mat-option [value]="32">32</mat-option>
                <mat-option [value]="36">36</mat-option>
                <mat-option [value]="42">42</mat-option>
                <mat-option [value]="48">48</mat-option>
              </mat-select>
            </mat-form-field>
          </div>          <div class="text-style-controls">
            <h4 class="section-title">Text Style</h4>
            <mat-button-toggle-group multiple aria-label="Text formatting options" class="format-toggle-group">
              <mat-button-toggle
                [checked]="textProps.fontWeight >= 700"
                (change)="toggleBold($event.source.checked)"
                matTooltip="Bold"
                class="format-toggle"
              >
                <mat-icon>format_bold</mat-icon>
              </mat-button-toggle>
              <mat-button-toggle
                [checked]="textProps.italic"
                (change)="toggleItalic($event.source.checked)"
                matTooltip="Italic"
                class="format-toggle"
              >
                <mat-icon>format_italic</mat-icon>
              </mat-button-toggle>
              <mat-button-toggle
                [checked]="textProps.underline"
                (change)="toggleUnderline($event.source.checked)"
                matTooltip="Underline"
                class="format-toggle"
              >
                <mat-icon>format_underlined</mat-icon>
              </mat-button-toggle>
            </mat-button-toggle-group>
          </div>

          <div class="color-picker">
            <label>Text Color:</label>
            <div class="color-options">
              @for (color of textColors; track color) {
                <div
                  class="color-option"
                  [style.background-color]="color"
                  [class.selected]="textProps.color === color"
                  (click)="selectColor(color)"
                ></div>
              }
            </div>
          </div>          <div class="add-text-button-container">
            <button
              mat-flat-button
              color="primary"
              (click)="addText()"
              [disabled]="!textProps.text.trim()"
            >
              <mat-icon>add</mat-icon>
              Add to Design
            </button>
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      .text-editor-container {
        display: flex;
        flex-direction: column;
        gap: 24px;
      }

      .full-width {
        width: 100%;
      }

      .text-format-section {
        display: flex;
        gap: 16px;
        margin-bottom: 8px;
      }      .text-style-controls {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        margin-bottom: 20px;
      }

      .format-toggle-group {
        border-radius: 4px;
        overflow: hidden;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .format-toggle {
        min-width: 48px;
        padding: 0 12px;
      }

      ::ng-deep .mdc-button-toggle-button {
        height: 36px !important;
      }

      ::ng-deep .mat-button-toggle-checked {
        background-color: rgba(63, 81, 181, 0.15);
        color: #3f51b5;
      }

      .color-picker {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-bottom: 20px;
      }

      .color-picker label {
        font-weight: 500;
        margin-bottom: 4px;
      }

      .color-options {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .color-option {
        width: 30px;
        height: 30px;
        border-radius: 4px;
        cursor: pointer;
        border: 2px solid transparent;
        transition: transform 0.2s, border-color 0.2s;
      }

      .color-option:hover {
        transform: scale(1.1);
      }

      .color-option.selected {
        border-color: #3f51b5;
        transform: scale(1.1);
      }      .section-title {
        margin-top: 12px;
        margin-bottom: 8px;
        color: #333;
        font-weight: 500;
        font-size: 1rem;
        border-bottom: 1px solid #eee;
        padding-bottom: 4px;
      }

      .add-text-button-container {
        display: flex;
        justify-content: flex-end;
        margin-top: 16px;
      }

      .add-button {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 0 16px;
        height: 36px;
        transition: transform 0.2s;
      }

      .add-button:not([disabled]):hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      }
    `,
  ],
})
export class TextEditorComponent {
  @Input() initialText: TextProperties = {
    text: '',
    fontFamily: 'Arial',
    fontSize: 24,
    fontWeight: 400,
    color: '#000000',
    textAlign: 'center',
  };

  @Output() textAdded = new EventEmitter<TextProperties>();
  textProps: TextProperties = {
    text: '',
    fontFamily: 'Arial',
    fontSize: 24,
    fontWeight: 400,
    color: '#000000',
    textAlign: 'center', // Default to center alignment since we removed the control
    italic: false,
    underline: false,
  };

  textColors: string[] = [
    '#000000', // Black
    '#FFFFFF', // White
    '#FF0000', // Red
    '#00FF00', // Green
    '#0000FF', // Blue
    '#FFFF00', // Yellow
    '#FFA500', // Orange
    '#800080', // Purple
    '#FFC0CB', // Pink
    '#A52A2A', // Brown
    '#808080', // Gray
    '#00FFFF', // Cyan
  ];

  ngOnInit() {
    // Initialize with any input values
    this.textProps = { ...this.initialText };
  }

  selectColor(color: string): void {
    this.textProps.color = color;
    this.textChanged();
  }

  toggleBold(checked: boolean): void {
    this.textProps.fontWeight = checked ? 700 : 400;
    this.textChanged();
  }

  toggleItalic(checked: boolean): void {
    this.textProps.italic = checked;
    this.textChanged();
  }

  toggleUnderline(checked: boolean): void {
    this.textProps.underline = checked;
    this.textChanged();
  }

  textChanged(): void {
    // Optional: Add a preview update here if needed
  }

  addText(): void {
    if (this.textProps.text.trim()) {
      this.textAdded.emit({ ...this.textProps });
    }
  }
}