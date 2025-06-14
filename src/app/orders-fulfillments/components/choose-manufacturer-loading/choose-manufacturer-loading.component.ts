import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-choose-manufacturer-loading',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatProgressSpinnerModule],
  templateUrl: './choose-manufacturer-loading.component.html',
  styleUrl: './choose-manufacturer-loading.component.css'
})
export class ChooseManufacturerLoadingComponent {
  @Input() message: string = 'Loading manufacturers...';
  @Input() description: string = 'Please wait while we get the information.';
  @Input() spinnerDiameter: number = 60;
}
