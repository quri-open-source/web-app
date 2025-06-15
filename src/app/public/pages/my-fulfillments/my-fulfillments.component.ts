import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { FulfillmentService } from '../../../orders-fulfillments/services/fulfillment.service';
import { Fulfillment } from '../../../orders-fulfillments/model/fulfillment.entity';
import { FulfillmentHeaderComponent } from '../../../orders-fulfillments/components/fulfillment-header/fulfillment-header.component';
import { FulfillmentListComponent } from '../../../orders-fulfillments/components/fulfillment-list/fulfillment-list.component';

@Component({
  selector: 'app-my-fulfillments',
  standalone: true,  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatChipsModule,
    FulfillmentHeaderComponent,
    FulfillmentListComponent
  ],
  templateUrl: './my-fulfillments.component.html',
  styleUrls: ['./my-fulfillments.component.css']
})
export class FulfillmentsListComponent implements OnInit {
  private fulfillmentService = inject(FulfillmentService);
  private snackBar = inject(MatSnackBar);

  fulfillments: Fulfillment[] = [];
  loading = true;
  error = false;

  ngOnInit() {
    this.loadFulfillments();
  }

  loadFulfillments() {
    this.loading = true;
    this.error = false;

    this.fulfillmentService.getAllFulfillments().subscribe({
      next: (fulfillments) => {
        this.fulfillments = fulfillments;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading fulfillments:', error);
        this.error = true;
        this.loading = false;
        this.snackBar.open('Error loading fulfillments', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      }    });
  }

  onRefresh() {
    this.loadFulfillments();
  }
}
