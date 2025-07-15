import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';
import { from, map, switchMap, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // First wait for auth to be initialized from storage
  return from(authService.waitForAuthInitialized()).pipe(
    // Then check the current user
    switchMap(() => authService.currentUser$.pipe(take(1))),
    map(user => {
      // If user not authenticated
      if (!user) {
        router.navigate(['/login'], { 
          queryParams: { 
            returnUrl: state.url,
            reason: 'not_authenticated'
          } 
        });
        return false;
      }

      // Check if user has admin role
      const userRole = typeof user.role === 'string' ? user.role : user.role?.roleName;
      
      if (userRole !== 'admin') {
        console.error('User does not have admin role');
        router.navigate(['/login'], { 
          queryParams: { 
            reason: 'not_admin'
          } 
        });
        return false;
      }

      // Access granted
      return true;
    })
  );
};