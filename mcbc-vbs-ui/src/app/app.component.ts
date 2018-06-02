import { Component } from '@angular/core';
import { AppConfigService } from './config/app-config.service';
import { AppConfig } from './config/app-config';
import { Title } from '@angular/platform-browser';

/**
 * This is the application bootstrap component.
 */
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    public title: string;

    constructor(private _appConfigService: AppConfigService,
                private _titleService: Title) {
        this._appConfigService.appConfig$.subscribe((config: AppConfig) => {
            this.title = config.title;

            // Set the browser page title (the <title> element within the <head> element)
            // Note: this has to be done from code - see https://angular.io/guide/set-document-title
            this._titleService.setTitle(this.title);
        });
    }
}
