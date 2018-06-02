import { NgModule } from '@angular/core';
import { AdminModule } from './body/admin/admin.module';
import { AdminPageComponent } from './admin-page.component';
import { ImportMaterializeModule } from '../../import-materialize.module';
import { HeaderComponent } from './header/header.component';

@NgModule({
    declarations: [
        AdminPageComponent,
        HeaderComponent
    ],
    imports: [
        AdminModule,
        ImportMaterializeModule
    ],
    exports: [
        AdminPageComponent
    ]
})
export class AdminPageModule {
}
