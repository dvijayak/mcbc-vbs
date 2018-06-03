import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ServerAuthService } from './server-auth.service';
import { Observable } from 'rxjs';

/**
 * Only allows navigating to the admin page if the user is logged in (valid session)
 */
@Injectable()
export class AdminPageRouteGuardService implements CanActivate {
    constructor(private _authService: ServerAuthService,
                private _router: Router) {
    }

    /**
     * Guard access to the admin page by redirecting all unauthenticated accesses
     * to the login page
     */
    public canActivate(): Observable<boolean> {
        return this._authService.isUserAuthenticated().map(isAuth => {
            if (!isAuth) {
                this._router.navigateByUrl('/login');
            } else {
                return true;
            }
        }).take(1);
    }
}
