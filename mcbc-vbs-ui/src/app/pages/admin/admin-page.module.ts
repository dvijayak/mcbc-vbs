import { NgModule } from '@angular/core';
import { AdminModule } from './body/admin/admin.module';
import { AdminPageComponent } from './admin-page.component';
import { ImportMaterializeModule } from '../../import-materialize.module';
import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ServerAuthService } from './auth/server-auth.service';

@NgModule({
    declarations: [
        AdminPageComponent,
        HeaderComponent
    ],
    imports: [
        AdminModule,
        HttpClientModule,
        RouterModule, // although we don't have any internal routing needs, we still want to use `routerLink` in our templates
        ImportMaterializeModule
    ],
    providers: [
        ServerAuthService
    ],
    exports: [
        AdminPageComponent
    ]
})
export class AdminPageModule {
}
