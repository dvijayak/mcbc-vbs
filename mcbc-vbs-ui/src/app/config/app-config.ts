import { DomSanitizer } from '@angular/platform-browser';
import { SecurityContext } from '@angular/core';

export interface AppConfigOptions {
    sanitizer: DomSanitizer;
}

export class AppConfig {
    private _title = '';
    public get title(): string {
        return this._title;
    }

    private _serverUrl = '';
    public get serverUrl(): string {
        return this._serverUrl;
    }

    private _sanitizer: { sanitize: Function };

    constructor(json: any, options: AppConfigOptions | undefined) {
        if (options) {
            this._sanitizer = options.sanitizer;
        }

        this.updateFromJSON(json);
    }

    public updateFromJSON(json: any): void {
        if (!json) {
            return;
        }

        if (json.hasOwnProperty('title')) {
            this._title = json['title'].toString();
        }

        if (json.hasOwnProperty('serverUrl')) {
            if (this._sanitizer == null) {
                console.error('Cannot process `serverUrl` option without a valid sanitizer.');
            } else {
                this._serverUrl = this._sanitizer.sanitize(SecurityContext.URL, json['serverUrl'].toString()); // sanitazation must be done by caller
            }
        }
    }
}
