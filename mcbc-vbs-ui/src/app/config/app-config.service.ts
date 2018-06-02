import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReplaySubject } from 'rxjs';
import { AppConfig } from './app-config';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable()
export class AppConfigService {
    private _appConfig$ = new ReplaySubject<AppConfig>(1);
    public get appConfig$(): ReplaySubject<AppConfig> {
        return this._appConfig$;
    }

    constructor(private _http: HttpClient,
                private _sanitizer: DomSanitizer,
                @Inject('AppConfigFilePath') private _appConfigFilePath: string) {
        this._http.get(this._appConfigFilePath).subscribe(json => {
            const appConfig = new AppConfig(json, { sanitizer: this._sanitizer });
            this._appConfig$.next(appConfig);
        });
    }
}
