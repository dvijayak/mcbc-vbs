import { Component } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { HttpClient } from '@angular/common/http';

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

    private readonly targetUrl = '/login';
    private readonly successUrl = '/admin';

    public loginError = false;


    constructor(private _http: HttpClient) {
    }

    onSubmit(): void {
        // let headers = new Headers();
        // headers.append('Content-Type', 'application/json');
        // headers.append('Accept', 'application/json');
        // this._http.post(this.targetUrl, JSON.stringify(this.model), { headers: headers })
        //     .map((res: Response) => res.json())
        //     .subscribe(res => {
        //         this.loginError = false;
        //         window.location.href = res.data.redirectUrl;
        //     }, err => {
        //         this.loginError = true;
        //         console.error(err);
        //         window.location.href = err.data.redirectUrl;
        //     });
    }
}
