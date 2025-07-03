import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

/**
 * Role guard for protecting routes based on user roles
 * Uses localStorage to check the current user role
 */
export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return () => {
    const router = inject(Router);

    console.log('🛡️ [DEBUG] RoleGuard - Checking role access');
    console.log('🛡️ [DEBUG] RoleGuard - Allowed roles:', allowedRoles);

    // Check if user is authenticated first
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.log('🛡️ [DEBUG] RoleGuard - User not authenticated, redirecting to sign-in');
      router.navigate(['/sign-in']);
      return false;
    }

    // Get user role from localStorage
    const userRole = localStorage.getItem('quri_user_role');
    console.log('🛡️ [DEBUG] RoleGuard - Current user role:', userRole);

    // If no role is set, deny access to protected routes
    if (!userRole) {
      console.log('🛡️ [DEBUG] RoleGuard - No role found, access denied');
      router.navigate(['/home']);
      return false;
    }

    // Check if user role is in allowed roles
    const hasPermission = allowedRoles.includes(userRole);
    console.log('🛡️ [DEBUG] RoleGuard - Has permission:', hasPermission);

    if (!hasPermission) {
      console.log('🛡️ [DEBUG] RoleGuard - Access denied, redirecting to home');
      router.navigate(['/home']);
      return false;
    }

    console.log('🛡️ [DEBUG] RoleGuard - Access granted');
    return true;
  };
};
