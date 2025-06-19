import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { Manufacturer } from '../../model/manufacturer.entity';

@Component({
  selector: 'app-choose-manufacturer-form',
  standalone: true,  imports: [
    CommonModule, 
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './choose-manufacturer-form.component.html',
  styleUrl: './choose-manufacturer-form.component.css'
})
export class ChooseManufacturerFormComponent {
  @Input() manufacturers: Manufacturer[] = [];
  @Input() selectedManufacturer: Manufacturer | null = null;
  @Input() orderId: string = '';
  @Input() isLoading: boolean = false;

  @Output() manufacturerSelected = new EventEmitter<Manufacturer>();
  @Output() orderSubmitted = new EventEmitter<{ orderId: string; manufacturerId: string }>();

  selectedManufacturerId: string = '';

  onManufacturerChange(manufacturerId: string): void {
    const manufacturer = this.manufacturers.find(m => m.id === manufacturerId);
    if (manufacturer) {
      this.selectedManufacturerId = manufacturerId;
      this.manufacturerSelected.emit(manufacturer);
    }
  }

  onSubmitOrder(): void {
    if (this.selectedManufacturerId && this.orderId) {
      this.orderSubmitted.emit({
        orderId: this.orderId,
        manufacturerId: this.selectedManufacturerId
      });
    }
  }

  get isFormValid(): boolean {
    return !!this.selectedManufacturerId && !!this.orderId && !this.isLoading;
  }
}
