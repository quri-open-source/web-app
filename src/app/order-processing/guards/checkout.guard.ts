import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthenticationService } from '../../iam/services/authentication.service';

/**
 * Guard for protecting checkout routes.
 * @summary
 * This guard ensures that only authenticated users can access checkout routes.
 */
export const checkoutGuard: CanActivateFn = (_route, _state) => {
  const authenticationService = inject(AuthenticationService);
  const router = inject(Router);

  console.log('🛡️ CheckoutGuard: Verifying access to checkout');

  // Simple authentication check
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const username = localStorage.getItem('username');

  if (token && userId && username) {
    // Ensure authentication service is synced
    authenticationService.checkStoredAuthentication();
    console.log('✅ CheckoutGuard: Access granted');
    return true;
  }

  // No valid authentication found, redirect to sign-in
  console.log('❌ CheckoutGuard: No valid authentication, redirecting to sign-in');
  router.navigate(['/sign-in']).then();
  return false;
};
