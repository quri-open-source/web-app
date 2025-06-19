import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-fulfillment-header',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './fulfillment-header.component.html',
  styleUrl: './fulfillment-header.component.css'
})
export class FulfillmentHeaderComponent {
  @Input() title: string = 'Fulfillment Orders';
  @Input() subtitle: string = 'Manage your fulfillment orders';
  @Input() icon: string = 'local_shipping';
  @Input() totalCount: number = 0;
  @Input() showRefreshButton: boolean = true;
  @Output() refresh = new EventEmitter<void>();

  onRefresh() {
    this.refresh.emit();
  }
}
