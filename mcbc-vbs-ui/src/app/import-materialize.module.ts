import { NgModule } from '@angular/core';
import { MzButtonModule, MzCollapsibleModule, MzInputModule, MzNavbarModule, MzSidenavModule } from 'ng2-materialize';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/**
 * Aggregate all app-wide desired Materialize components into a single module that
 * can then be imported. See [manual](https://www.npmjs.com/package/ng2-materialize#materializemodule-deprecated) for more info.
 */
@NgModule({
    imports: [
        BrowserAnimationsModule,
        MzButtonModule,
        MzCollapsibleModule,
        MzNavbarModule,
        MzSidenavModule,
        MzInputModule
    ],
    exports: [
        BrowserAnimationsModule,
        MzButtonModule,
        MzCollapsibleModule,
        MzNavbarModule,
        MzSidenavModule,
        MzInputModule
    ]
})
export class ImportMaterializeModule {
}
