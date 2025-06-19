import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../../user-management/services/user.service';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return () => {
    const userService = inject(UserService);
    const router = inject(Router);
    
    // Get the current role directly from the service
    const userRole = userService.getUserRole();
    console.log('Role Guard - Current user role:', userRole);
    console.log('Role Guard - Allowed roles:', allowedRoles);
    console.log('Role Guard - Has access:', allowedRoles.includes(userRole));
    
    // If role is allowed, grant access
    if (allowedRoles.includes(userRole)) {
      console.log('Role Guard - Access granted');
      return true;
    }
    
    // Role not allowed, redirect appropriately
    console.log('Role Guard - Access denied, redirecting...');
    
    // Always redirect to the appropriate home page
    if (userRole === 'manufacturer') {
      console.log('Role Guard - Redirecting to manufacturer dashboard');
      router.navigate(['/manufacturer-dashboard']);
    } else {
      console.log('Role Guard - Redirecting to customer home');
      router.navigate(['/home']);
    }
    
    return false;
  };
};

export class Access {
  constructor(
    public id: string,
    public userId: string,
    public role: string,
    public permissions: string[]
  ) {}
}
