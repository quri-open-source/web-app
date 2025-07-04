import { Component, EventEmitter, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-choose-manufacturer-empty',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule
  ],
  templateUrl: './choose-manufacturer-empty.html',
  styleUrl: './choose-manufacturer-empty.css'
})
export class ChooseManufacturerEmpty {
  @Output() retryClicked = new EventEmitter<void>();

  onRetry(): void {
    this.retryClicked.emit();
  }
}
