import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';
import { from, map, switchMap, take } from 'rxjs';
import { ToastController } from '@ionic/angular';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastCtrl = inject(ToastController);

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

      // Check if route requires specific role
      const requiredRole = route.data['role'];
      const userRole = typeof user.role === 'string' ? user.role : user.role?.roleName;
      
      // Check if user has the required role
      let hasRequiredRole = false;
      
      if (requiredRole === 'client') {
        hasRequiredRole = userRole === 'client' || userRole === 'user';
      } else if (requiredRole === 'prestataire') {
        hasRequiredRole = userRole === 'prestataire' || userRole === 'professional' || userRole === 'veterinarian';
      }
      
      if (requiredRole && !hasRequiredRole) {
        // Show unauthorized toast
        toastCtrl.create({
          message: 'You don\'t have permission to access this page',
          duration: 3000,
          color: 'warning',
          position: 'top'
        }).then(toast => toast.present());

        // Redirect to appropriate dashboard
        const redirectPath = (userRole === 'client' || userRole === 'user')
          ? '/client/dashboard' 
          : '/provider/dashboard';
        router.navigate([redirectPath]);
        return false;
      }

      // Access granted
      return true;
    })
  );
};
