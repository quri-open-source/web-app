import { Component } from '@angular/core';
import { CheckoutFormComponent } from './payment-element.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [CheckoutFormComponent, TranslateModule],
  template: `
    <div class="checkout-container">
      <h2>{{ 'payment.checkout.title' | translate }}</h2>
      <ngstr-checkout-form [clientSecret]="clientSecret"></ngstr-checkout-form>
    </div>
  `,
  styles: [`
    .checkout-container {
      padding: 2rem;
      max-width: 600px;
      margin: 0 auto;
    }
    h2 {
      text-align: center;
      color: #1976d2;
      margin-bottom: 2rem;
    }
  `]
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
