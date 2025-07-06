import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderFulfillmentService } from '../../../order-fulfillments/services/order-fulfillment.service';
import { CreateOrderFulfillmentRequest } from '../../../order-fulfillments/services/order-fulfillments.response';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, RouterModule, TranslateModule, CommonModule],
  template: `
    <div class="payment-success-container">
      <mat-icon color="primary" style="font-size: 64px;">check_circle</mat-icon>
      <h2>{{ 'payment.success.title' | translate }}</h2>
      <p>{{ 'payment.success.message' | translate }}</p>
      <p class="order-info">{{ 'payment.success.orderInfo' | translate }}</p>
      <div *ngIf="fulfillmentError" class="fulfillment-error">
        <mat-icon color="warn">error</mat-icon>
        {{ fulfillmentError }}
      </div>
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
    .fulfillment-error {
      color: #d32f2f;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1rem;
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
export class PaymentSuccessComponent implements OnInit {
  private router = inject(Router);
  private fulfillmentService = inject(OrderFulfillmentService);
  fulfillmentError: string | null = null;

  ngOnInit(): void {
    // Obtener manufacturerId y orderId del navigation state o localStorage
    let manufacturerId = history.state?.manufacturerId || localStorage.getItem('manufacturerId');
    let orderId = history.state?.orderId || localStorage.getItem('orderId');

    // Si no están en navigation state, intenta recuperarlos de localStorage
    if (!manufacturerId) {
      manufacturerId = localStorage.getItem('manufacturerId');
    }
    if (!orderId) {
      orderId = localStorage.getItem('orderId');
    }

    if (manufacturerId && orderId) {
      const req: CreateOrderFulfillmentRequest = {
        manufacturerId,
        orderId
      };
      this.fulfillmentService.create(req).subscribe({
        next: () => {
          // Fulfillment creado exitosamente
          this.fulfillmentError = null;
          // Limpiar datos temporales
          localStorage.removeItem('manufacturerId');
          localStorage.removeItem('orderId');
        },
        error: (err) => {
          this.fulfillmentError = 'Error creando fulfillment: ' + (err?.message || err);
          // Opcional: log
          console.error('Error creando fulfillment:', err);
        }
      });
    } else {
      this.fulfillmentError = 'No se pudo obtener manufacturerId u orderId para crear el fulfillment.';
      console.warn('manufacturerId u orderId faltantes en success');
    }
  }
}
