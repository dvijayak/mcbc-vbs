import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ServerAuthService } from '../admin/auth/server-auth.service';
import { Observable } from 'rxjs';

import 'rxjs/add/operator/take';

/**
 * Redirects to the admin page if the user is already logged in
 */
@Injectable()
export class LoginPageRouteRedirectService implements CanActivate {
    constructor(private _authService: ServerAuthService,
                private _router: Router) {
    }

    /**
     * Redirect logged-in users to the admin page automatically
     */
    public canActivate(): Observable<boolean> {
        return this._authService.isUserAuthenticated().map(isAuth => {
            if (isAuth) {
                this._router.navigateByUrl('/admin');
            } else {
                return true; // not authenticated, so we should continue to the login page
            }
        }).take(1);
    }
}
