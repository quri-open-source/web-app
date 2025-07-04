import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Interceptor for adding the authentication token to the request headers.
 * @summary
 * This interceptor adds the authentication token to the request headers if it exists in local storage.
 * If the token does not exist, the request is sent as is.
 * @param request The request object.
 * @param next The next function.
 */
export const authenticationInterceptor: HttpInterceptorFn = (request, next) => {
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
  
  // Return the handled request.
  return next(handledRequest);
};
