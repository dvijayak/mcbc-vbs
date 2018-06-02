import { Component } from '@angular/core';
import { AppConfigService } from './config/app-config.service';
import { AppConfig } from './config/app-config';

/**
 * This is the application bootstrap component.
 */
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [
        AppConfigService
    ]
})
export class AppComponent {
    public title: string;

    constructor(private _appConfigService: AppConfigService) {
        this._appConfigService.appConfig$.subscribe((config: AppConfig) => {
            this.title = config.title;
        });
    }
}
