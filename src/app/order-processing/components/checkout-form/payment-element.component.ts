import { Component, inject, Input, signal, ViewChild } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';

import {
  injectStripe,
  NgxStripeModule,
  StripePaymentElementComponent
} from 'ngx-stripe';
import {
  StripeElementsOptions,
  StripePaymentElementOptions
} from '@stripe/stripe-js';
import { environment } from '../../../../environments/environment.prod';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';
import { CartService } from '../../../shared/services/cart.service';

@Component({
  selector: 'ngstr-checkout-form',
  templateUrl: './payment-element.component.html',
  styleUrls: ['./payment-element.component.css'],
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    StripePaymentElementComponent,
    NgxStripeModule,
    MatButton
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
        redirect: 'if_required'
      })
      .subscribe(result => {
        this.paying.set(false);
        if (result.error) {
          // Show error to your customer (e.g., insufficient funds)
          console.log({ success: false, error: result.error.message });
        } else {
          // The payment has been processed!
        if (result.paymentIntent.status === 'succeeded') {
          // Limpiar carrito y redirigir a pantalla de éxito
          this.cartService.clearCart();
          this.router.navigate(['/home/order-processing/payment/ok']);
        }
        }
      });
  }
}
