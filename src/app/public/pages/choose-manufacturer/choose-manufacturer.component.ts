import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { ManufacturerService } from '../../../orders-fulfillments/services/manufacturer.service';
import { Manufacturer } from '../../../orders-fulfillments/model/manufacturer.entity';
import { Fulfillment } from '../../../orders-fulfillments/model/fulfillment.entity';
import {
  ChooseManufacturerFormComponent
} from '../../../orders-fulfillments/components/choose-manufacturer-form/choose-manufacturer-form.component';
import {
  ChooseManufacturerHeaderComponent
} from '../../../orders-fulfillments/components/choose-manufacturer-header/choose-manufacturer-header.component';
import {
  ChooseManufacturerLoadingComponent
} from '../../../orders-fulfillments/components/choose-manufacturer-loading/choose-manufacturer-loading.component';
import {
  ChooseManufacturerErrorComponent
} from '../../../orders-fulfillments/components/choose-manufacturer-error/choose-manufacturer-error.component';
import {
  ChooseManufacturerSuccessComponent
} from '../../../orders-fulfillments/components/choose-manufacturer-success/choose-manufacturer-success.component';
import {
  ChooseManufacturerEmpty
} from '../../../orders-fulfillments/components/choose-manufacturer-empty/choose-manufacturer-empty';

@Component({
  selector: 'app-choose-manufacturer',
  standalone: true,
  imports: [
    CommonModule,
    ChooseManufacturerFormComponent,
    ChooseManufacturerHeaderComponent,
    ChooseManufacturerLoadingComponent,
    ChooseManufacturerErrorComponent,
    ChooseManufacturerSuccessComponent,
    ChooseManufacturerEmpty,
    MatSnackBarModule
  ],
  templateUrl: './choose-manufacturer.component.html',
  styleUrl: './choose-manufacturer.component.css'
})
export class ChooseManufacturerComponent implements OnInit {
  manufacturers: Manufacturer[] = [];
  selectedManufacturer: Manufacturer | null = null;
  orderId: string = '';
  isLoading: boolean = false;
  error: string = '';
  success: string = '';
  constructor(
    private manufacturerService: ManufacturerService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}
  ngOnInit(): void {
    // Get orderId from route parameters
    this.route.queryParams.subscribe(params => {
      this.orderId = params['orderId'] || '';
      if (!this.orderId) {
        this.error = 'Order ID not found. Redirecting...';
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 3000);
        return;
      }
    });

    this.loadManufacturers();
  }  private loadManufacturers(): void {
    this.isLoading = true;
    this.error = '';

    console.log('Starting manufacturer loading...');
    console.log('Service URL:', this.manufacturerService.getURL());

    this.manufacturerService.getAllManufacturers().subscribe({
      next: (manufacturers: Manufacturer[]) => {
        console.log('Manufacturers loaded successfully:', manufacturers);
        this.manufacturers = manufacturers;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Complete error loading manufacturers:', error);
        console.error('Error message:', error.message);
        console.error('HTTP status:', error.status);
        console.error('Error URL:', error.url);

        let errorMessage = 'Error loading manufacturers. ';

        if (error.status === 0) {
          errorMessage += 'Cannot connect to server. Please verify the server is running on http://localhost:3000';
        } else if (error.status === 404) {
          errorMessage += 'The /manufacturers endpoint was not found.';
        } else if (error.status >= 500) {
          errorMessage += 'Internal server error.';
        } else {
          errorMessage += `HTTP Error ${error.status}: ${error.message}`;
        }

        this.error = errorMessage;
        this.isLoading = false;
      }
    });
  }  onManufacturerSelected(manufacturer: Manufacturer): void {
    this.selectedManufacturer = manufacturer;
    this.error = '';

    // Show selection notification
    this.snackBar.open(`Manufacturer ${manufacturer.name} selected`, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }  onOrderSubmitted(data: { orderId: string; manufacturerId: string }): void {
    if (!data.orderId || !data.manufacturerId) {
      this.error = 'Please complete all required fields.';
      this.snackBar.open('Please complete all required fields.', 'Close', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    this.isLoading = true;
    this.error = '';
    this.success = '';

    const fulfillmentRequest = {
      order_id: data.orderId,
      manufacturer_id: data.manufacturerId,
      status: 'pending'
    };

    this.manufacturerService.createFulfillment(fulfillmentRequest).subscribe({
      next: (fulfillment: Fulfillment) => {
        this.success = `Order assigned successfully! Fulfillment ID: ${fulfillment.id}`;
        this.isLoading = false;

        // Show success notification
        this.snackBar.open('Order assigned successfully!', 'View Orders', {
          duration: 8000,
          panelClass: ['success-snackbar']
        }).onAction().subscribe(() => {
          this.router.navigate(['/orders']);
        });

        // Redirect after 5 seconds
        setTimeout(() => {
          this.router.navigate(['/orders'], {
            queryParams: { message: 'order-assigned' }
          });
        }, 5000);
      },
      error: (error) => {
        console.error('Error creating fulfillment:', error);
        this.error = 'Error assigning order. Please try again.';
        this.isLoading = false;

        // Show error notification
        this.snackBar.open('Error assigning order. Try again.', 'Retry', {
          duration: 8000,
          panelClass: ['error-snackbar']
        }).onAction().subscribe(() => {
          this.onOrderSubmitted(data);
        });
      }
    });
  }

  onRetry(): void {
    this.error = '';
    this.success = '';
    this.loadManufacturers();
  }
}
