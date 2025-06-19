import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Fulfillment } from '../../../orders-fulfillments/model/fulfillment.entity';

@Component({
  selector: 'app-fulfillment-item',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './fulfillment-item.component.html',
  styleUrls: ['./fulfillment-item.component.css']
})
export class FulfillmentItemComponent {
  @Input() fulfillment!: Fulfillment;
}
