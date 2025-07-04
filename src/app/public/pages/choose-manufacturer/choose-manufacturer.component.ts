import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { ManufacturerService } from '../../../orders-fulfillments/services/manufacturer.service';
import { Manufacturer } from '../../../orders-fulfillments/model/manufacturer.entity';
import { Fulfillment } from '../../../orders-fulfillments/model/fulfillment.entity';
import { environment } from '../../../../environments/environment';
import { AuthenticationService } from '../../../iam/services/authentication.service';
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
    private snackBar: MatSnackBar,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    // Check if user is logged in using localStorage (IAM system)
    const userId = localStorage.getItem('userId');
    if (!userId) {
      this.error = 'No active user. Please log in to continue.';
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 3000);
      return;
    }

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
    // Service URL not available in new implementation
    // console.log('Service URL:', this.manufacturerService.getURL());

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
          errorMessage += `Cannot connect to server. Please verify the server is running on ${environment.apiBaseUrl}`;
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
    // Check if user is logged in and has customer role using localStorage (IAM system)
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');

    if (!userId) {
      this.error = 'No active user. Please log in to continue.';
      this.snackBar.open('Please log in to submit orders', 'Close', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    if (userRole !== 'customer') {
      this.error = 'Only customers can submit orders. Please switch to customer role.';
      this.snackBar.open('Please switch to customer role to place orders', 'Close', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
      return;
    }

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

    // Build request payload with camelCase keys to match CreateFulfillmentRequest
    const fulfillmentRequest = {
      orderId: data.orderId,
      manufacturerId: data.manufacturerId,
      status: 'pending'
    };

    this.manufacturerService.createFulfillment(fulfillmentRequest).subscribe({
      next: (fulfillment: Fulfillment) => {
        this.success = `Order assigned successfully! Fulfillment ID: ${fulfillment.id}`;
        this.isLoading = false;

        // Show success notification
        this.snackBar.open('Order assigned successfully! Cart has been cleared.', 'View Orders', {
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
