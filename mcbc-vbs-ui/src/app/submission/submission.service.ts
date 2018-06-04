import { Injectable, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AppConfigService } from '../config/app-config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, ReplaySubject } from 'rxjs';

import 'rxjs/add/operator/mergeMap';

export class SubmissionOptions {
    serverUrl = ''; // includes the protocol; by default, localhost
    query: string;
    pretty: boolean;
    data: any;

    constructor(query: string, options: any) {
        // Required
        this.query = query;

        // Optional
        this.pretty = options.pretty || false;
        this.data = options.data;
    }

    createUrl(): string {
        let url = `${this.serverUrl}/api/${this.query}`;

        // CANIMPROVE: Really brittle - will need to be changed if we add more parameters
        if (this.pretty) {
            url += '?pretty=true';
        }

        return url;
    }
}

@Injectable()
export class SubmissionService {

    private _serverUrl$ = new ReplaySubject<string>(1);

    constructor(private _http: HttpClient,
                private _sanitizer: DomSanitizer,
                private _appConfigService: AppConfigService) {
        this._appConfigService.appConfig$.subscribe(config => {
            if (config.serverUrl) {
                this._serverUrl$.next(config.serverUrl);
            } else {
                console.error('No `serverUrl` was configured. Cannot access data from server.');
            }
        });
    }

    private processData(data) {
        if (!data.submissions || !data.submissions.length) {
            return Promise.resolve();
        }

        if (!data.headers) {
            data.headers = {};
        }

        // Provide headers where unprovided
        const sample = data.submissions[0];
        for (const prop in sample) {
            if (!data.headers[prop]) {
                data.headers[prop] = prop;
            }
        }

        // We are good to go!
        return data;
    }

    // The result must be an array of submissions
    public getSubmissions(options: SubmissionOptions): Observable<any> {
        return this._serverUrl$
            .mergeMap(serverUrl => {
                options.serverUrl = serverUrl;
                const url = this._sanitizer.sanitize(SecurityContext.URL, options.createUrl());
                const headers = new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                });
                return this._http.get<any>(url, {
                    headers: headers,
                    withCredentials: true // needed for CORS request cookies to work
                }).map(json => json.data || {});
            })
            .map(data => this.processData(data))
            // catch and rethrow just so that we can log failures here before consumers deal with it
            .catch(err => {
                console.error(`Failed to retrieve submissions from server: ${err}`)
                throw err;
            });
    }

    public putSubmission(options: SubmissionOptions): Observable<any> {
        return this._serverUrl$
            .mergeMap(serverUrl => {
                options.serverUrl = serverUrl;
                const url = this._sanitizer.sanitize(SecurityContext.URL, options.createUrl());
                const headers = new HttpHeaders({
                    'Content-Type': 'application/json'
                });
                // CANIMPROVE: support API tokens
                return this._http.put<any>(url, options.data, {
                    headers: headers,
                    withCredentials: true // needed for CORS request cookies to work
                }).map(json => json.data || {});
            });
    }
}
