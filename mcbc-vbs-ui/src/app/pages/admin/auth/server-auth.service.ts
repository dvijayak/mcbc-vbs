import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../../../config/app-config.service';
import { Observable, ReplaySubject } from 'rxjs';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/mergeMap';

@Injectable()
export class ServerAuthService {

    private _serverUrl$ = new ReplaySubject<string>(1);

    constructor(private _http: HttpClient,
                private _appConfigService: AppConfigService) {
        this._appConfigService.appConfig$.subscribe(config => {
            this._serverUrl$.next(config.serverUrl);
        });
    }

    /**
     * Creates a fresh request and informs the caller of the validity of the user's session
     */
    public isUserAuthenticated(): Observable<boolean> {
        return this._serverUrl$
            .mergeMap(url => this._http.post(`${url}/authenticate`, null, {
                withCredentials: true // needed for CORS request cookies to work
            }))
            .map(res => true) // an emit means that the response is OK
            .catch(err => Observable.of(false)); // assume all errors imply failure to authenticate
    }
}
