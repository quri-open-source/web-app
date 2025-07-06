import { Component, inject, Input, signal, ViewChild } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import {
  injectStripe,
  NgxStripeModule,
  StripePaymentElementComponent
} from 'ngx-stripe';
import {
  StripeElementsOptions,
  StripePaymentElementOptions
} from '@stripe/stripe-js';
import { environment } from '../../../../environments/environment';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';
import { CartService } from '../../../shared/services/cart.service';
import { OrderProcessingService } from '../../../order-processing/services/order-processing.service';
import { CreateOrderRequest } from '../../../order-processing/services/order-processing.response';
import { AuthenticationService } from '../../../iam/services/authentication.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'ngstr-checkout-form',
  templateUrl: './payment-element.component.html',
  styleUrls: ['./payment-element.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    StripePaymentElementComponent,
    NgxStripeModule,
    MatButton,
    TranslateModule,
    MatIconModule
  ]
})
export class CheckoutFormComponent {
  @ViewChild(StripePaymentElementComponent)
  paymentElement!: StripePaymentElementComponent;

  // Recibe el clientSecret por parámetro
  @Input() clientSecret!: string;

  private readonly fb = inject(UntypedFormBuilder);
  private readonly router = inject(Router);
  private readonly cartService = inject(CartService);
  private readonly translateService = inject(TranslateService);
  private readonly orderProcessingService = inject(OrderProcessingService);
  private readonly authService = inject(AuthenticationService);

  paymentElementForm = this.fb.group({
    name: ['John Doe', [Validators.required]],
    email: ['support@ngx-stripe.dev', [Validators.required]],
    address: [''],
    zipcode: [''],
    city: [''],
    amount: [2500, [Validators.required, Validators.pattern(/\d+/)]]
  });

  get elementsOptions(): StripeElementsOptions {
    return {
      locale: 'en',
      clientSecret: this.clientSecret,
      appearance: {
        theme: 'flat'
      }
    };
  }

  paymentElementOptions: StripePaymentElementOptions = {
    layout: {
      type: 'tabs',
      defaultCollapsed: false
    }
  };

  // Replace with your own public key
  stripe = injectStripe(environment.stripePublicKey);
  paying = signal(false);

  pay() {
    if (this.paying() || this.paymentElementForm.invalid) return;

    this.paying.set(true);

    const {
      name,
      email,
      address,
      zipcode,
      city
    } = this.paymentElementForm.getRawValue();

    this.stripe
      .confirmPayment({
        elements: this.paymentElement.elements,
        confirmParams: {
          payment_method_data: {
            billing_details: {
              name: name as string,
              email: email as string,
              address: {
                line1: address as string,
                postal_code: zipcode as string,
                city: city as string
              }
            }
          }
        },
        redirect: "if_required",
      })
      .subscribe(result => {
        this.paying.set(false);
        if (result.error) {
          console.error('❌ Payment failed:', result.error.message);
          // Show error to your customer (e.g., insufficient funds)
        } else {
          // The payment has been processed!
          if (result.paymentIntent.status === 'succeeded') {
            // Get userId and products from the cart
            this.authService.currentUserId.subscribe(userId => {
              if (!userId) {
                // Handle unauthenticated user error
                this.router.navigate(['/home/iam/sign-in']);
                return;
              }
              const items = this.cartService.cartItems.map(item => ({
                productId: item.productId,
                quantity: 1 // Adjust if you have real quantity
              }));
              const orderRequest: CreateOrderRequest = { userId, items };
              this.orderProcessingService.createOrder(orderRequest).subscribe({
                next: (order) => {
                  localStorage.setItem('orderId', order.id);
                  this.cartService.clearCart();
                  this.router.navigate(['/home/order-processing/payment/ok']);
                },
                error: (err) => {
                  // Handle error when creating the order
                  console.error('Error creating order:', err);
                }
              });
            });
          } else {
            console.warn('⚠️ Payment intent status:', result.paymentIntent.status);
          }
        }
      });
  }
}
