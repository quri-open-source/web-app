import { CanActivateFn, Router } from '@angular/router';
import { inject } from "@angular/core";
import { AuthenticationService } from "./authentication.service";
import { map, take } from "rxjs";

/**
 * Guard for redirecting authenticated users away from auth pages
 * @summary
 * This guard checks if the user is already signed in. If they are, it redirects them to home.
 * If the user is not signed in, it allows access to the auth pages.
 * @param route The route object.
 * @param state The state object.
 */
export const redirectAuthenticatedGuard: CanActivateFn = (_route, _state) => {
  const authenticationService = inject(AuthenticationService);
  const router = inject(Router);

  return authenticationService.isSignedIn.pipe(
    take(1),
    map(isSignedIn => {
      if (isSignedIn) {
        // User is already authenticated, redirect to home
        router.navigate(['/home']).then();
        return false;
      } else {
        // User is not authenticated, allow access to auth pages
        return true;
      }
    })
  );
};
