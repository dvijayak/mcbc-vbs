import { Component } from '@angular/core';

import { ReplaySubject } from 'rxjs';

import { IntercomService } from '../body/admin/intercom.service';
import { AppConfigService } from '../../../config/app-config.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
    selector: 'app-admin-page-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent {

    private _serverUrl$ = new ReplaySubject<string>(1);

    constructor(private intercom: IntercomService,
                private _http: HttpClient,
                private _router: Router,
                private _appConfigService: AppConfigService) {
        this._appConfigService.appConfig$.subscribe(config => {
            this._serverUrl$.next(config.serverUrl);
        });
    }

    public onClickChildDataSource(): void {
        this.intercom.emitQuery('child');
    }

    public onClickVolunteerDataSource(): void {
        this.intercom.emitQuery('volunteer');
    }

    public onClickLogout(): void {
        this._serverUrl$.subscribe(url => {
            if (url) {
                this._http.post(`${url}/logout`, null, {
                    withCredentials: true // needed for CORS request cookies to work
                }).subscribe(() => this._router.navigateByUrl('/'));
            }
        });
    }

}
