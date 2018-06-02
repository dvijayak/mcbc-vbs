import { Component } from '@angular/core';

import { IntercomService } from './intercom.service';

@Component({
    selector: 'app-admin-page-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.css']
})
export class AdminComponent {

    public query = 'child'; // we begin by showing the children registrations
    public displayedColumns = new Array<string>();
    public filters = new Array<string>();

    constructor(private _intercom: IntercomService) {
        this._intercom.query$.subscribe(query => this.query = query); // no need to track subscription to unsubscribe upon component
                                                                          // destruction - why? because we are subscribing to a *child*
                                                                          // component, so if the parent component dies, the child will
                                                                          // also die, thus guaranteeing no memory leak
    }
}
