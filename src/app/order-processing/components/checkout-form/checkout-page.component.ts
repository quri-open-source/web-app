import { Component } from '@angular/core';
import { CheckoutFormComponent } from './payment-element.component';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [CheckoutFormComponent, TranslateModule, CommonModule, MatIconModule],
  template: `
    <div class="checkout-container">
      <h2>{{ 'payment.checkout.title' | translate }}</h2>
      <ng-container *ngIf="clientSecret; else errorState">
        <ngstr-checkout-form [clientSecret]="clientSecret"></ngstr-checkout-form>
      </ng-container>
      <ng-template #errorState>
        <div class="error-message">
          <mat-icon color="warn" style="font-size:48px;">error</mat-icon>
          <h3>{{ 'payment.checkout.noClientSecret' | translate }}</h3>
          <a mat-stroked-button color="primary" routerLink="/home/cart">{{ 'cart.title' | translate }}</a>
        </div>
      </ng-template>
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

  constructor(private router: Router) {
    // 1. Intenta obtener el clientSecret del navigation state
    if (history.state && history.state.clientSecret) {
      this.clientSecret = history.state.clientSecret;
    } else {
      // 2. Intenta obtenerlo de sessionStorage (por si el usuario recarga la página)
      const storedSecret = sessionStorage.getItem('clientSecret');
      if (storedSecret) {
        this.clientSecret = storedSecret;
      } else {
        this.clientSecret = '';
      }
    }
    // 3. Si lo tenemos, lo guardamos en sessionStorage para persistencia en recarga
    if (this.clientSecret) {
      sessionStorage.setItem('clientSecret', this.clientSecret);
    } else {
      sessionStorage.removeItem('clientSecret');
    }
  }
}
