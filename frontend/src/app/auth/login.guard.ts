import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';
import { from, map, switchMap, take } from 'rxjs';

export const loginGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // First wait for auth to be initialized from storage
  return from(authService.waitForAuthInitialized()).pipe(
    // Then check the current user
    switchMap(() => authService.currentUser$.pipe(take(1))),
    map(user => {
      // If user is already authenticated, redirect to appropriate dashboard
      if (user) {
        const userRole = typeof user.role === 'string' ? user.role : user.role?.roleName;
        
        // Redirect based on user role
        if (userRole === 'client' || userRole === 'user') {
          router.navigate(['/client/dashboard']);
        } else if (userRole === 'prestataire' || userRole === 'professional' || userRole === 'veterinarian') {
          router.navigate(['/provider/dashboard']);
        }
        
        // Prevent access to login page
        return false;
      }
      
      // Allow access to login page if not authenticated
      return true;
    })
  );
};