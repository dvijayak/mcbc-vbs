import { Component } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { AppConfigService } from '../../../../config/app-config.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

class User {
    username: string;
    password: string;
}

@Component({
    selector: 'app-login-page-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {

    public model = new User();

    private readonly _targetUrl = '/login';
    private readonly _successUrl = '/admin';

    public loginError = false;

    private _ready$ = new BehaviorSubject<boolean>(false);
    private _serverUrl = '';

    constructor(private _http: HttpClient,
                private _router: Router,
                private _appConfigService: AppConfigService) {
        this._appConfigService.appConfig$.subscribe(config => {
            if (config.serverUrl) {
                this._serverUrl = config.serverUrl;
                this._ready$.next(true); // notify
            } else {
                console.error('No `serverUrl` was configured. Cannot access data from server.');
            }
        });
    }

    onSubmit(): void {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });
        const errHandler = (err) => {
            this.loginError = true;
            console.error(err);
        }
        this._http.post(`${this._serverUrl}${this._targetUrl}`, JSON.stringify(this.model), {
            headers: headers,
            withCredentials: true // needed for CORS request cookies to work
        }).subscribe(res => {
                console.log(res);
                this.loginError = false;
                this._router.navigateByUrl(this._successUrl);
            }, err => errHandler(err));
    }
}
