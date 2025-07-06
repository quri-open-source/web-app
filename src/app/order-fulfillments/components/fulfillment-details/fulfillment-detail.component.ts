import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { OrderFulfillmentService } from '../../services/order-fulfillment.service';
import { OrderFulfillment } from '../../model/order-fulfillment.entity';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { FulfillmentItemService } from '../../services/fulfillment-item.service';

@Component({
  selector: 'app-fulfillment-detail',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, TranslateModule],
  templateUrl: './fulfillment-detail.component.html',
  styleUrls: ['./fulfillment-detail.component.css']
})
export class FulfillmentDetailComponent {
  fulfillmentId = inject(ActivatedRoute).snapshot.paramMap.get('fulfillmentId')!;
  fulfillment$: Observable<OrderFulfillment>;
  items$: Observable<any[]>;

  constructor(
    private fulfillmentService: OrderFulfillmentService,
    private fulfillmentItemService: FulfillmentItemService
  ) {
    this.fulfillment$ = this.fulfillmentService.getById(this.fulfillmentId);
    this.items$ = this.fulfillmentItemService.getRawItemsByFulfillmentId(this.fulfillmentId);
  }
}
