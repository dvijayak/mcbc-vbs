import { NgModule } from '@angular/core';
import { AdminModule } from './body/admin/admin.module';
import { AdminPageComponent } from './admin-page.component';
import { ImportMaterializeModule } from '../../import-materialize.module';
import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [
        AdminPageComponent,
        HeaderComponent
    ],
    imports: [
        AdminModule,
        RouterModule, // although we don't have any internal routing needs, we still want to use `routerLink` in our templates
        ImportMaterializeModule
    ],
    exports: [
        AdminPageComponent
    ]
})
export class AdminPageModule {
}
