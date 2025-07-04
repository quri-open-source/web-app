import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthenticationService } from './authentication.service';

/**
 * Interceptor for adding the authentication token to the request headers and handling auth errors.
 * @summary
 * This interceptor adds the authentication token to the request headers if it exists in local storage.
 * If the token does not exist, the request is sent as is.
 * Additionally, it handles 401 (Unauthorized) responses by clearing the stored token and redirecting to sign-in.
 * @param request The request object.
 * @param next The next function.
 */
export const authenticationInterceptor: HttpInterceptorFn = (request, next) => {
  const router = inject(Router);
  const authService = inject(AuthenticationService);

  console.log('🔧 AuthInterceptor - Processing request to:', request.url);
  console.log('🔧 AuthInterceptor - Request method:', request.method);

  // Get the token from local storage.
  const token = localStorage.getItem('token');
  console.log('🔑 AuthInterceptor - Token from localStorage:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');

  // If the token exists, add it to the request headers. Otherwise, send the request as is.
  const handledRequest = token
    ? request.clone({
        headers: request.headers.set('Authorization', `Bearer ${token}`),
      })
    : request;

  console.log('📡 AuthInterceptor - Final headers:');
  console.log('  - Authorization:', handledRequest.headers.get('Authorization') ? `Bearer ${handledRequest.headers.get('Authorization')?.substring(7, 27)}...` : 'NOT SET');
  console.log('  - Content-Type:', handledRequest.headers.get('Content-Type') || 'NOT SET');
  console.log('  - All header keys:', handledRequest.headers.keys());

  // Return the handled request with error handling.
  return next(handledRequest).pipe(
    catchError((error) => {
      console.log('❌ AuthInterceptor - Error caught:', error);

      // If we get a 401 Unauthorized error, it means the token is invalid
      if (error.status === 401) {
        console.log('🚨 AuthInterceptor - 401 Unauthorized detected, clearing session and redirecting to sign-in');

        // Clear the session using the AuthenticationService
        authService.clearSession();

        // Redirect to sign-in page
        router.navigate(['/sign-in']).then(() => {
          console.log('🔄 AuthInterceptor - Redirected to sign-in page');
        });
      }

      // Re-throw the error for other components to handle
      return throwError(() => error);
    })
  );
};
