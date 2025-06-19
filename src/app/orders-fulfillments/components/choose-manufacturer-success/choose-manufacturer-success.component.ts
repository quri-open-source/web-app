import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-choose-manufacturer-success',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './choose-manufacturer-success.component.html',
  styleUrl: './choose-manufacturer-success.component.css'
})
export class ChooseManufacturerSuccessComponent {
  @Input() successMessage: string = '';
  @Input() showAnimation: boolean = true;
}
