import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, RouterModule],
  template: `
    <div class="payment-success-container">
      <mat-icon color="primary" style="font-size: 64px;">check_circle</mat-icon>
      <h2>¡Pago realizado con éxito!</h2>
      <p>Gracias por tu compra. Tu pago fue procesado correctamente.</p>
      <a mat-stroked-button color="primary" routerLink="/home">Volver al inicio</a>
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
    }
    h2 { color: #1976d2; }
    p { color: #333; }
  `]
})
export class PaymentSuccessComponent {}
