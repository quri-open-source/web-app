import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, RouterModule, TranslateModule],
  template: `
    <div class="payment-success-container">
      <mat-icon color="primary" style="font-size: 64px;">check_circle</mat-icon>
      <h2>{{ 'payment.success.title' | translate }}</h2>
      <p>{{ 'payment.success.message' | translate }}</p>
      <p class="order-info">{{ 'payment.success.orderInfo' | translate }}</p>
      <div class="action-buttons">
        <a mat-stroked-button color="primary" routerLink="/home">
          <mat-icon>home</mat-icon>
          {{ 'payment.success.goHome' | translate }}
        </a>
        <a mat-raised-button color="accent" routerLink="/home/catalog">
          <mat-icon>shopping_cart</mat-icon>
          {{ 'payment.success.continueShopping' | translate }}
        </a>
      </div>
    </div>
  `,
  styles: [`
    .payment-success-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 60vh;
      gap: 1.5rem;
      text-align: center;
      padding: 2rem;
    }
    h2 {
      color: #1976d2;
      margin: 0;
      font-size: 2rem;
    }
    p {
      color: #333;
      margin: 0.5rem 0;
      font-size: 1.1rem;
    }
    .order-info {
      color: #666;
      font-size: 1rem;
      max-width: 400px;
    }
    .action-buttons {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
      flex-wrap: wrap;
      justify-content: center;
    }
    .action-buttons a {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    @media (max-width: 600px) {
      .action-buttons {
        flex-direction: column;
        width: 100%;
        max-width: 300px;
      }
    }
  `]
})
export class PaymentSuccessComponent {}
