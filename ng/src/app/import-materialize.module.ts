import { NgModule } from '@angular/core';
import { MzButtonModule, MzNavbarModule, MzSidenavModule } from 'ng2-materialize';

/**
 * Aggregate all app-wide desired Materialize components into a single module that
 * can then be imported. See [manual](https://www.npmjs.com/package/ng2-materialize#materializemodule-deprecated) for more info.
 */
@NgModule({
    imports: [
        MzButtonModule,
        MzNavbarModule,
        MzSidenavModule
    ],
    exports: [
        MzButtonModule,
        MzNavbarModule,
        MzSidenavModule
    ]
})
export class ImportMaterializeModule {
}
