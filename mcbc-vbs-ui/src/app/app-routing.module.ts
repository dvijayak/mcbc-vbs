import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './pages/home/home-page.component';
import { LoginPageComponent } from './pages/login/login-page.component';
import { AdminPageComponent } from './pages/admin/admin-page.component';
import { AdminPageRouteGuardService } from './pages/admin/auth/admin-page-route-guard.service';
import { LoginPageRouteRedirectService } from './pages/login/login-page-route-redirect.service';

const routes: Routes = [
    {
        path: '',
        component: HomePageComponent,
    },
    {
        path: 'login',
        component: LoginPageComponent,
        canActivate: [LoginPageRouteRedirectService]
    },
    {
        path: 'admin',
        component: AdminPageComponent,
        canActivate: [AdminPageRouteGuardService]
    },
    {
        path: '**',
        redirectTo: '/'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    providers: [
        AdminPageRouteGuardService,
        LoginPageRouteRedirectService
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
