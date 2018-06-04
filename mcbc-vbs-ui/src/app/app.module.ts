import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// Some universally useful rxjs includes
import 'rxjs/add/operator/map';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { AppConfigService } from './config/app-config.service';
import { HomePageModule } from './pages/home/home-page.module';
import { LoginPageModule } from './pages/login/login-page.module';
import { AdminPageModule } from './pages/admin/admin-page.module';
import { AppRoutingModule } from './app-routing.module';
import { SubmissionService } from './submission/submission.service';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        CommonModule,
        HttpClientModule,
        HomePageModule,
        LoginPageModule,
        AdminPageModule,
        AppRoutingModule,
    ],
    providers: [
        { provide: 'AppConfigFilePath', useValue: 'assets/app.config.json' },
        AppConfigService,
        SubmissionService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
