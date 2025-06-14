import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-choose-manufacturer-error',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './choose-manufacturer-error.component.html',
  styleUrl: './choose-manufacturer-error.component.css'
})
export class ChooseManufacturerErrorComponent {
  @Input() errorMessage: string = '';
  @Input() showRetryButton: boolean = true;
  @Input() retryButtonText: string = 'Retry';
  @Output() retryClicked = new EventEmitter<void>();

  onRetry(): void {
    this.retryClicked.emit();
  }
}
