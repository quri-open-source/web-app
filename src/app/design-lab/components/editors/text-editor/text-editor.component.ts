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
import { TextLayer } from '../../../model/layer.entity';

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

// Configuration interface for text editor
export interface TextEditorConfig {
  defaultPosition: { x: number; y: number };
  centerTextCalculation: boolean;
  defaultZIndex: number;
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
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.css'],
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

  @Input() config: TextEditorConfig = {
    defaultPosition: { x: 160, y: 150 },
    centerTextCalculation: true,
    defaultZIndex: 1
  };

  @Input() existingTextLayers: TextLayer[] = [];

  @Output() textAdded = new EventEmitter<TextProperties>();
  @Output() textLayerCreated = new EventEmitter<TextLayer>();

  textProps: TextProperties = {
    text: '',
    fontFamily: 'Arial',
    fontSize: 24,
    fontWeight: 400,
    color: '#000000',
    textAlign: 'center',
    italic: false,
    underline: false,
  };

  fontFamilies: string[] = [
    'Arial',
    'Helvetica',
    'Times New Roman',
    'Courier New',
    'Verdana',
    'Georgia',
    'Comic Sans MS',
    'Impact',
    'Trebuchet MS',
    'Arial Black'
  ];

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
      // Emit the text properties for backward compatibility
      this.textAdded.emit({ ...this.textProps });

      // Create and emit a proper TextLayer entity
      const textLayer = this.createTextLayer(this.textProps);
      this.textLayerCreated.emit(textLayer);

      // Clear the form after adding
      this.resetForm();
    }
  }

  private createTextLayer(textProps: TextProperties): TextLayer {
    const id = 'text_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

    // Calculate position
    let x = this.config.defaultPosition.x;
    let y = this.config.defaultPosition.y;

    if (this.config.centerTextCalculation) {
      // Center text horizontally based on text length and font size
      x = x - (textProps.text.length * textProps.fontSize) / 6;
    }

    // Calculate z-index based on existing layers
    const zIndex = this.existingTextLayers.length + this.config.defaultZIndex;

    return new TextLayer(
      id,
      x,
      y,
      zIndex,
      1, // opacity
      true, // isVisible
      new Date(), // createdAt
      new Date(), // updatedAt
      {
        isItalic: textProps.italic || false,
        fontFamily: textProps.fontFamily,
        isUnderlined: textProps.underline || false,
        fontSize: textProps.fontSize,
        text: textProps.text,
        fontColor: textProps.color,
        isBold: textProps.fontWeight >= 700,
      }
    );
  }

  private resetForm(): void {
    this.textProps = {
      text: '',
      fontFamily: 'Arial',
      fontSize: 24,
      fontWeight: 400,
      color: '#000000',
      textAlign: 'center',
      italic: false,
      underline: false,
    };
  }

  // Validation methods
  isTextValid(): boolean {
    return this.textProps.text.trim().length > 0;
  }

  getPreviewStyles(): any {
    return {
      'font-family': this.textProps.fontFamily,
      'font-size': this.textProps.fontSize + 'px',
      'font-weight': this.textProps.fontWeight,
      'color': this.textProps.color,
      'text-align': this.textProps.textAlign,
      'font-style': this.textProps.italic ? 'italic' : 'normal',
      'text-decoration': this.textProps.underline ? 'underline' : 'none'
    };
  }
}
