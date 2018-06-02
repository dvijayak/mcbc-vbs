import { NgModule } from '@angular/core';
import { HomePageComponent } from './home-page.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './body/home/home.component';
import { ImportMaterializeModule } from '../../import-materialize.module';

@NgModule({
    declarations: [
        HomePageComponent,
        HeaderComponent,
        FooterComponent,
        HomeComponent
    ],
    imports: [
        ImportMaterializeModule,
    ],
    providers: [

    ],
    entryComponents: [
        HomePageComponent
    ],
    exports: [
        HomePageComponent
    ]
})
export class HomePageModule { }
