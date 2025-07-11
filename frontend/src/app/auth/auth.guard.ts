import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';
import { map, take } from 'rxjs';
import { ToastController } from '@ionic/angular';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastCtrl = inject(ToastController);

  return authService.currentUser$.pipe(
    take(1),
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
      if (requiredRole && user.role !== requiredRole) {
        // Show unauthorized toast
        toastCtrl.create({
          message: 'You don\'t have permission to access this page',
          duration: 3000,
          color: 'warning',
          position: 'top'
        }).then(toast => toast.present());

        // Redirect to appropriate dashboard
        const redirectPath = user.role === 'client' 
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
