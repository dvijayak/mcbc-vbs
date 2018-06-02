import { Component, OnInit } from '@angular/core';

import { IntercomService } from '../body/admin/intercom.service';

@Component({
    selector: 'app-admin-page-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

    constructor(private intercom: IntercomService) {
    }

    ngOnInit() {
    }

    onClickChildDataSource(): void {
        this.intercom.emitQuery('child');
    }

    onClickVolunteerDataSource(): void {
        this.intercom.emitQuery('volunteer');
    }

}
