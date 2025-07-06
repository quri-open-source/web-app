import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CartService } from '../../services/cart.service';
import { ProductCatalogService } from '../../../product-catalog/services/product-catalog.service';
import { ProductResponse } from '../../../product-catalog/services/product.response';
import { ProductUtils } from '../../../product-catalog/model/product.utils';
import { AuthenticationService } from '../../../iam/services/authentication.service';
import { OrderProcessingService } from '../../../order-processing/services/order-processing.service';
import { CreateOrderPaymentIntentRequest } from '../../../order-processing/services/order-processing.response';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-cart',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatToolbarModule,
        MatDividerModule,
        MatListModule,
        MatChipsModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        MatTooltipModule,
        MatDialogModule,
        TranslateModule,
    ],
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
    cartProducts: ProductResponse[] = [];
    loading = false;

    constructor(
        public cartService: CartService,
        private productCatalogService: ProductCatalogService,
        private router: Router,
        private snackBar: MatSnackBar,
        private translateService: TranslateService,
        private authService: AuthenticationService,
        private dialog: MatDialog,
        private orderProcessingService: OrderProcessingService // <-- nuevo
    ) {}

    ngOnInit() {
        this.loadCartProducts();
    }

    loadCartProducts() {
        this.loading = true;
        const productIds = this.cartService.getCartProductIds();

        if (productIds.length === 0) {
            this.cartProducts = [];
            this.loading = false;
            return;
        }

        // Load product details for each product in cart
        const productObservables = productIds.map((id) =>
            this.productCatalogService.getProductById(id)
        );

        forkJoin(productObservables).subscribe({
            next: (products) => {
                this.cartProducts = products;
                this.loading = false;
            },
            error: (error) => {
                console.error('Error loading cart products:', error);
                this.loading = false;
                const message = this.translateService.instant(
                    'cart.errorLoadingProducts'
                );
                this.snackBar.open(
                    message,
                    this.translateService.instant('common.close'),
                    {
                        duration: 5000,
                        horizontalPosition: 'end',
                        verticalPosition: 'top',
                    }
                );
            },
        });
    }

    goBack() {
        this.router.navigate(['/home']);
    }

    goToCatalog() {
        this.router.navigate(['/home/catalog']);
    }

    viewProduct(product: ProductResponse) {
        this.router.navigate(['/home/catalog', product.id]);
    }

    removeFromCart(product: ProductResponse) {
        const success = this.cartService.removeFromCart(product.id);

        if (success) {
            // Remove from local array
            this.cartProducts = this.cartProducts.filter(
                (p) => p.id !== product.id
            );

            const message = this.translateService.instant(
                'cart.removedFromCart'
            );
            this.snackBar.open(
                message,
                this.translateService.instant('common.close'),
                {
                    duration: 3000,
                    horizontalPosition: 'end',
                    verticalPosition: 'top',
                    panelClass: ['success-snackbar'],
                }
            );
        }
    }

    clearCart() {
        this.cartService.clearCart();
        this.cartProducts = [];

        const message = this.translateService.instant('cart.cartCleared');
        this.snackBar.open(
            message,
            this.translateService.instant('common.close'),
            {
                duration: 3000,
                horizontalPosition: 'end',
                verticalPosition: 'top',
                panelClass: ['success-snackbar'],
            }
        );
    }

    proceedToCheckout() {
        this.authService.currentUserId.subscribe((userId) => {
            if (!userId || userId === '') {
                const message =
                    this.translateService.instant('cart.loginRequired');
                this.snackBar.open(
                    message,
                    this.translateService.instant('common.close'),
                    {
                        duration: 5000,
                        horizontalPosition: 'end',
                        verticalPosition: 'top',
                    }
                );
                return;
            }

            // Calcular el monto total y la moneda
            const total = this.cartProducts.reduce(
                (sum, product) => sum + product.priceAmount,
                0
            );
            const currency =
                this.cartProducts.length > 0
                    ? this.cartProducts[0].priceCurrency
                    : 'USD';

            // Crear la request para el intent de pago
            const paymentIntentRequest: CreateOrderPaymentIntentRequest = {
                amount: total, // Stripe espera centavos
                currency,
            };

            this.orderProcessingService.createPaymentIntent(paymentIntentRequest).subscribe({
                next: (response) => {
                    // Redirigir a checkout con el secret key
                    this.router.navigate(['/home/order-processing/checkout'], {
                        state: { clientSecret: response.secretKey },
                    });
                },
                error: (err) => {
                    const message = this.translateService.instant(
                        'cart.paymentIntentError'
                    );
                    this.snackBar.open(
                        message,
                        this.translateService.instant('common.close'),
                        {
                            duration: 5000,
                            horizontalPosition: 'end',
                            verticalPosition: 'top',
                        }
                    );
                },
            });
        });
    }

    getTotalPrice(): string {
        const total = this.cartProducts.reduce(
            (sum, product) => sum + product.priceAmount,
            0
        );
        // Assume all products have the same currency for simplicity
        const currency =
            this.cartProducts.length > 0
                ? this.cartProducts[0].priceCurrency
                : 'USD';
        return ProductUtils.formatPrice(total, currency);
    }

    onImageError(event: any) {
        event.target.src = '/assets/placeholder-image.svg';
    }

    formatPrice(amount: number, currency: string): string {
        return ProductUtils.formatPrice(amount, currency);
    }

    getStatusLabel(status: string): string {
        return ProductUtils.getStatusLabel(status as any);
    }

    getStatusClass(status: string): string {
        return ProductUtils.getStatusClass(status as any);
    }

    getStatusIcon(status: string): string {
        switch (status?.toUpperCase()) {
            case 'AVAILABLE':
                return 'check_circle';
            case 'UNAVAILABLE':
                return 'cancel';
            case 'OUT_OF_STOCK':
                return 'inventory';
            case 'DISCONTINUED':
                return 'block';
            default:
                return 'help';
        }
    }
}
