import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class DebugInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('🌐 HTTP Request:', {
      method: req.method,
      url: req.url,
      headers: req.headers.keys().reduce((acc: any, key) => {
        acc[key] = req.headers.get(key);
        return acc;
      }, {}),
      body: req.body
    });

    // Clone the request and add additional headers for CORS if needed
    const corsReq = req.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    return next.handle(corsReq).pipe(
      tap(event => {
        console.log('✅ HTTP Response:', event);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('❌ HTTP Error:', {
          status: error.status,
          statusText: error.statusText,
          url: error.url,
          message: error.message,
          error: error.error,
          headers: error.headers?.keys().reduce((acc: any, key) => {
            acc[key] = error.headers.get(key);
            return acc;
          }, {})
        });

        // Handle CORS errors specifically
        if (error.status === 0 && error.statusText === 'Unknown Error') {
          console.error('🚫 Possible CORS error detected!');
          console.error('Check that the server is running and has CORS enabled');
          console.error('Also check the proxy configuration in angular.json');
        }

        return throwError(() => error);
      })
    );
  }
}
