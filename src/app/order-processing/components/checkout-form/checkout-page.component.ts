import { Component } from '@angular/core';
import { CheckoutFormComponent } from './payment-element.component';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [CheckoutFormComponent],
  template: `
    <div class="checkout-container">
      <h2>Checkout</h2>
      <ngstr-checkout-form [clientSecret]="clientSecret"></ngstr-checkout-form>
    </div>
  `,
})
export class CheckoutPageComponent {
  clientSecret = '';

  constructor() {
    // Si el clientSecret viene por navigation state
    if (history.state && history.state.clientSecret) {
      this.clientSecret = history.state.clientSecret;
    }
  }
}
