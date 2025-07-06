import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthenticationService } from '../../iam/services/authentication.service';

/**
 * Guard for protecting the payment success page.
 * @summary
 * This guard ensures that only authenticated users can access the payment success page
 * and helps prevent unwanted redirects.
 */
export const paymentSuccessGuard: CanActivateFn = (_route, state) => {
  const authenticationService = inject(AuthenticationService);
  const router = inject(Router);

  console.log('🛡️ PaymentSuccessGuard: Checking access to payment success page');

  // Check authentication
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const username = localStorage.getItem('username');

  if (!token || !userId || !username) {
    console.log('❌ PaymentSuccessGuard: User not authenticated, redirecting to sign-in');
    router.navigate(['/sign-in']).then();
    return false;
  }

  // Sync authentication service state
  authenticationService.checkStoredAuthentication();

  console.log('✅ PaymentSuccessGuard: Access granted to payment success page');
  return true;
};
