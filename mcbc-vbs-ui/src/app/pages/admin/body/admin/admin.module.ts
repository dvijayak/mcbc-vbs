import { NgModule } from '@angular/core';
import { AdminComponent } from './admin.component';
import { DatatableComponent } from './datatable/datatable.component';
import { IntercomService } from './intercom.service';
import { NgArrayPipesModule, NgObjectPipesModule } from 'ngx-pipes';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { ImportMaterializeModule } from '../../../../import-materialize.module';

@NgModule({
    declarations: [
        AdminComponent,
        DatatableComponent
    ],
    imports: [
        HttpModule,
        HttpClientModule,
        ImportMaterializeModule,
        NgArrayPipesModule,
        NgObjectPipesModule,
        NgxDatatableModule
    ],
    providers: [
        IntercomService
    ],
    exports: [
        AdminComponent
    ]
})
export class AdminModule {
}
