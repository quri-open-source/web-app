import { Component, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatBadgeModule } from '@angular/material/badge';
import { TranslateModule } from '@ngx-translate/core';

import { OrderFulfillment } from '../../../order-fulfillments/model/order-fulfillment.entity';
import { OrderFulfillmentService } from '../../../order-fulfillments/services/order-fulfillment.service';
import { AuthenticationService } from '../../../iam/services/authentication.service';
import { ManufacturerService } from '../../../order-fulfillments/services/manufacturer.service';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-fulfillments',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatExpansionModule,
    MatBadgeModule,
    TranslateModule,
    MatButton
  ],
  providers: [DatePipe],
  templateUrl: './fulfillments.component.html',
styleUrls: ['./fulfillments.component.css'],
})
export class FulfillmentsComponent {
  fulfillments = signal<OrderFulfillment[]>([]);

  constructor(
    private auth: AuthenticationService,
    private manufacturerService: ManufacturerService,
    private orderFulfillmentService: OrderFulfillmentService
  ) {
    this.auth.currentUserId.subscribe(userId => {
      this.manufacturerService.getByUserId(userId).subscribe(manufacturer => {
        this.orderFulfillmentService.getAll(manufacturer.id).subscribe(data => {
          this.fulfillments.set(data);
        });
      });
    });
  }

  getStatusClass(status: string): string {
    return `status-badge ${status.toLowerCase()}`;
  }

  viewDetails(f: OrderFulfillment) {
    // TODO: Implement navigation or dialog for details
    console.log('View details for fulfillment:', f);
    // Example: this.router.navigate(['/fulfillments', f.id]);
  }
}
