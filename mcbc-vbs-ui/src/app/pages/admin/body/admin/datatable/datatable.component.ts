import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';

import { SubmissionOptions, SubmissionService } from '../../../../../submission/submission.service';
import { AppConfigService } from '../../../../../config/app-config.service';
import { BehaviorSubject } from 'rxjs';

const objectValues = (obj => Object.keys(obj).map(key => obj[key])); // courtesy of
                                                                     // http://stackoverflow.com/questions/7306669/how-to-get-all-properties-values-of-a-javascript-object-without-knowing-the-key/16643074#16643074

/// Model representing submissions (children/volunteers)
class DataModel {
    submissions: any[] = [];
    headers: any[] = [];
}

@Component({
    selector: 'app-admin-page-admin-datatable',
    templateUrl: './datatable.component.html',
    styleUrls: ['./datatable.component.css'],
})
export class DatatableComponent implements OnInit, OnChanges {

    public model: DataModel = new DataModel();
    public csvDataUri: SafeUrl = '#!';
    public csvExportFilename = 'data.csv';

    private _serverUrl = '';

    private _ready$ = new BehaviorSubject<boolean>(false);

    constructor(private submissionService: SubmissionService,
                private _appConfigService: AppConfigService,
                private _sanitizer: DomSanitizer) {
    }

    @Input() query: string = 'child';
    @Input() displayedColumns: string[]; // TODO: Default to all? Or some?
    @Input() filters: string[] = [];

    ngOnInit() {
        this._appConfigService.appConfig$.subscribe(config => {
            if (config.serverUrl) {
                this._serverUrl = config.serverUrl;
                this._ready$.next(true); // notify
            } else {
                console.error('No `serverUrl` was configured. Cannot access data from server.');
            }
        });

        // Since ngOnChanges is guaranteed to be called before ngOnInit upon initialization
        // as per the Angular lifecycle hooks design, we don't need to initialize the data
        // model here, thus saving us one expensive HTTP request.
    }

    ngOnChanges(changes: SimpleChanges) {
        for (const prop in changes) {
            switch (prop) {
                case 'query':
                    this.refreshModel(true);
                    break;
                case 'displayedColumns':
                    // TODO
                    break;
                case 'filters':
                    this.refreshModel(false); // we are applying a client-side filter
                    break;
                default:
                    console.error('Unhandled data-bound input property change.');
            }
        }
    }

    onClickReload(): void {
        this.refreshModel(true);
    }


    private refreshModel(fetch: boolean): void {
        this._ready$.subscribe(isReady => {
            if (isReady) {
                // 1. retrieve submissions from server, if requested
                Promise.resolve(fetch)
                    .then(fetch => {
                        if (fetch) {
                            return this.submissionService.getSubmissions(new SubmissionOptions(this._serverUrl, this.query, {
                                pretty: true
                            })).then(this.updateDataModel.bind(this));
                        } else {
                            return Promise.resolve();
                        }
                    })
                    .then(() => {
                        // 2. apply any filters
                        // TODO

                        // 3. reflect these changes where relevant
                        this.csvDataUri = this.generateCSVDataUriFromModel();
                        this.csvExportFilename = `MCBC_VBS_2018_SubmissionsCSVExport_${this.query}_${new Date().toDateString()}.csv`;
                        // TODO: Configure prefix string
                    });
            }
        });
    }

    private updateDataModel(data) {
        if (!data)
            return;

        // Note: change detection will be triggered

        this.model.submissions = data.submissions;

        // Transform headers into ngx-datatable format
        this.model.headers = [];
        for (const prop of Object.keys(data.headers)) {
            this.model.headers.push({
                prop: prop,
                name: data.headers[prop],
            });
        }
    }

    private generateCSVDataUriFromModel(): SafeUrl {
        if (this.model.headers.length < 1 && this.model.submissions.length < 1)
            return '#!';

        const commaSeparate = (acc, val) => acc + '|' + val; // can't use the comma for "comma-separating", due to the existence of commas
                                                             // in address
        let dataUri = 'data:application/octet-stream,';
        dataUri += this.model.headers.map(header => header.name).reduce(commaSeparate);
        dataUri += '\n';

        const headerProps = this.model.headers.map(header => header.prop);
        for (const submission of this.model.submissions) {
            dataUri += headerProps.map(prop => submission[prop]).reduce(commaSeparate);
            dataUri += '\n';
        }

        return this._sanitizer.bypassSecurityTrustUrl(encodeURI(dataUri));
    }
}
