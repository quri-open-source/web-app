import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { OrderFulfillmentService } from '../../../order-fulfillments/services/order-fulfillment.service';
import { AuthenticationService } from '../../../iam/services/authentication.service';
import { ManufacturerService } from '../../../order-fulfillments/services/manufacturer.service';

@Component({
    selector: 'app-fulfillments',
    standalone: true,
    imports: [MatCardModule, MatIconModule],
    template: `
        <div
            style="display: flex; justify-content: center; align-items: center; min-height: 60vh; background: #f5f5f5;"
        >
            <mat-card
                style="max-width: 420px; width: 100%; padding: 2rem; border-radius: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);"
            >
                <mat-card-header>
                    <mat-card-title>
                        <mat-icon
                            color="primary"
                            style="vertical-align: middle; margin-right: 8px;"
                            >local_shipping</mat-icon
                        >
                        Fulfillments
                    </mat-card-title>
                </mat-card-header>
                <mat-card-content>
                    <p
                        style="margin-top: 1rem; color: #666; text-align: center;"
                    >
                        This is a placeholder for the Fulfillments section.<br />
                        Only visible to manufacturers.
                    </p>
                </mat-card-content>
            </mat-card>
        </div>
    `,
})
export class FulfillmentsComponent {
    private fulfillments: any[] = []; // Placeholder for fulfillment data

    constructor(
        private orderFulfillmentService: OrderFulfillmentService,
        private userService: AuthenticationService,
        private manufacturerService: ManufacturerService
    ) {
        userService.currentUserId.subscribe({
            next: (userId) => {
                console.log('Fetching fulfillments for user:', userId);
                this.manufacturerService
                    .getByUserId(userId)
                    .subscribe({
                        next: (user) => {
                            const manufacturerId = user.id;
                            console.log('Manufacturer ID:', manufacturerId);
                            orderFulfillmentService.getAll(manufacturerId).subscribe({
                                next: (fulfillments) => {
                                    console.log('Fulfillments fetched:', fulfillments);
                                    this.fulfillments = fulfillments;
                                },
                            });
                        }
                    });
            },
        });
    }
}
