import { Injectable, SecurityContext } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { DomSanitizer } from '@angular/platform-browser';

export class SubmissionOptions {
    serverUrl: string; // includes the protocol
    query: string;
    pretty: boolean;
    data: any;

    constructor(serverUrl: string, query: string, options: any) {
        // Required
        this.serverUrl = serverUrl;
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

    constructor(private http: Http,
                private _sanitizer: DomSanitizer) {
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
        return Promise.resolve(data);
    }

    // The result must be an array of submissions
    public getSubmissions(options: SubmissionOptions): Promise<any> {
        const url = this._sanitizer.sanitize(SecurityContext.URL, options.createUrl());

        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        return this.http.get(url, {
            headers: headers,
            withCredentials: true // needed for CORS request cookies to work
        })
            .map((res: Response) => res.json().data || {})
            .toPromise()
            .then(this.processData)
            .catch(err => console.error(`Failed to retrieve submissions from server: ${err}`));
    }

    public putSubmission (options: SubmissionOptions): Promise<any> {
        const url = this._sanitizer.sanitize(SecurityContext.URL, options.createUrl());

        const headers = new Headers();
        headers.append('Content-Type', 'application/json');

        // CANIMPROVE: attach API token

        return this.http.put(url, options.data, {
            headers: headers,
            withCredentials: true // needed for CORS request cookies to work
        })
            .map((res: Response) => res.json().data || {})
            .toPromise();
    }
}
