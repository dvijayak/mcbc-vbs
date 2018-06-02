import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule
    ],
    providers: [
        { provide: 'AppConfigFilePath', useValue: 'assets/app.config.json' }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
