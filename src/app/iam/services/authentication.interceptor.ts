import {HttpInterceptorFn} from '@angular/common/http';

/**
 * Interceptor for adding the authentication token to the request headers.
 * @summary
 * This interceptor adds the authentication token to the request headers if it exists in local storage.
 * If the token does not exist, the request is sent as is.
 * @param request The request object.
 * @param next The next function.
 */
export const authenticationInterceptor: HttpInterceptorFn = (
  request,
  next) => {
  // Get the token from local storage.
  const token = localStorage.getItem('token');

  // If no token, send request as is
  if (!token) {
    console.log('🔧 Interceptor - No token found, sending request without Authorization header');
    return next(request);
  }

  // Validate token format (basic check)
  if (token.length < 10) {
    console.error('🔧 Interceptor - Token seems invalid (too short):', token);
    return next(request);
  }

  // Add Bearer prefix to token and set Authorization header
  const authHeaderValue = `Bearer ${token}`;
  const handledRequest = request.clone({
    headers: request.headers.set('Authorization', authHeaderValue)
  });

  // Return the handled request.
  return next(handledRequest);
};
