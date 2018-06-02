import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageRoutingModule } from './home-page-routing.module';
import { ImportMaterializeModule } from '../../import-materialize.module';
import { HomePageComponent } from './home-page.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './body/home/home.component';
import { FaqComponent } from './body/faq/faq.component';

@NgModule({
    declarations: [
        HomePageComponent,
        HeaderComponent,
        FooterComponent,
        HomeComponent,
        FaqComponent
    ],
    imports: [
        CommonModule,
        HomePageRoutingModule,
        ImportMaterializeModule
    ],
    entryComponents: [
        HomePageComponent
    ],
    exports: [
        HomePageComponent
    ]
})
export class HomePageModule {
}
