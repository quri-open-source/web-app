import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Fulfillment } from '../../model/fulfillment.entity';
import { FulfillmentItemComponent } from '../fulfillment-item/fulfillment-item.component';

@Component({
  selector: 'app-fulfillment-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    FulfillmentItemComponent
  ],
  templateUrl: './fulfillment-list.component.html',
  styleUrls: ['./fulfillment-list.component.css']
})
export class FulfillmentListComponent {
  @Input() fulfillments: Fulfillment[] = [];
  @Input() loading = false;
  @Input() error = false;
  @Output() refresh = new EventEmitter<void>();

  onRefresh() {
    this.refresh.emit();
  }
}
