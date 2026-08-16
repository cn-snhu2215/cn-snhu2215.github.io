import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

// This guard ensures that only admin users can navigate to the requested route.
export const adminGuard: CanActivateFn = () => {
    const auth = inject(AuthenticationService);
    const router = inject(Router);

    if (auth.isAdmin()) return true;

    // user is not admin, don't navigate to the requested page
    router.navigate(['']);
    return false;
}

// This guard ensures that the request os coming from any valid, registered user.
// Admin is not required
export const authGuard: CanActivateFn = () => {
    const auth = inject(AuthenticationService);
    const router = inject(Router);

    if (auth.isLoggedIn()) return true;

    // not logged in as user, don't navigate to the requested route
    router.navigate(['']);
    return false;
}
