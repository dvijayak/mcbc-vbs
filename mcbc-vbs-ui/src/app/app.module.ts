import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { HomePageModule } from './pages/home/home-page.module';
import { LoginPageModule } from './pages/login/login-page.module';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        CommonModule,
        HttpClientModule,
        ReactiveFormsModule,
        HomePageModule,
        LoginPageModule,
        AppRoutingModule,
    ],
    providers: [
        { provide: 'AppConfigFilePath', useValue: 'assets/app.config.json' }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
