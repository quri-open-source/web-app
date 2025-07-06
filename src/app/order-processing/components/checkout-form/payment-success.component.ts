import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { AuthenticationService } from '../../../iam/services/authentication.service';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
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
export class PaymentSuccessComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private hasNavigatedToSuccess = false;

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('🎉 PaymentSuccessComponent initialized');
    
    // Verificar que el usuario esté autenticado
    this.verifyAuthentication();
    
    // Marcar que hemos llegado exitosamente a la página de éxito
    this.hasNavigatedToSuccess = true;
    
    // Prevenir navegaciones no deseadas durante los primeros segundos
    this.preventUnwantedRedirects();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private verifyAuthentication() {
    // Verificar el estado de autenticación sin causar redirecciones
    const isAuthenticated = this.authService.isAuthenticated();
    if (!isAuthenticated) {
      console.warn('⚠️ User not authenticated on payment success page');
      // No redirigir inmediatamente, permitir que el usuario vea el mensaje de éxito
      setTimeout(() => {
        this.router.navigate(['/sign-in']);
      }, 5000); // Dar 5 segundos para ver el mensaje
    }
  }

  private preventUnwantedRedirects() {
    // Monitorear navegaciones para prevenir redirecciones inmediatas
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: NavigationEnd) => {
        console.log('🔄 Navigation detected:', event.url);
        
        // Si acabamos de llegar a success y hay una redirección inmediata, prevenirla
        if (this.hasNavigatedToSuccess && 
            event.url !== '/home/order-processing/payment/ok' &&
            Date.now() - this.initTime < 2000) { // Dentro de 2 segundos
          console.warn('⚠️ Preventing immediate redirect from payment success');
          // Volver a la página de éxito
          setTimeout(() => {
            this.router.navigate(['/home/order-processing/payment/ok'], { replaceUrl: true });
          }, 100);
        }
      });
  }

  private initTime = Date.now();
}
