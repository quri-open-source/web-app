import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-choose-manufacturer-header',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './choose-manufacturer-header.component.html',
  styleUrl: './choose-manufacturer-header.component.css'
})
export class ChooseManufacturerHeaderComponent {
  @Input() orderId: string = '';
  @Input() title: string = 'Assign Manufacturer';
  @Input() icon: string = 'assignment';
}
