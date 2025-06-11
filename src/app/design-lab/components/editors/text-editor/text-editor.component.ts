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