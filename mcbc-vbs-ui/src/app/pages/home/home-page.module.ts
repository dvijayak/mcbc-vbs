import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageRoutingModule } from './home-page-routing.module';
import { ImportMaterializeModule } from '../../import-materialize.module';
import { HomePageComponent } from './home-page.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './body/home/home.component';
import { FaqComponent } from './body/faq/faq.component';
import { RegisterComponent } from './body/register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VolunteerComponent } from './body/volunteer/volunteer.component';

@NgModule({
    declarations: [
        HomePageComponent,
        HeaderComponent,
        FooterComponent,
        HomeComponent,
        FaqComponent,
        RegisterComponent,
        VolunteerComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HomePageRoutingModule,
        ImportMaterializeModule
    ],
    exports: [
        HomePageComponent
    ]
})
export class HomePageModule {
}
