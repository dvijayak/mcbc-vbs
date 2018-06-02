import { Component, OnInit } from '@angular/core';

import { FaqItem } from './model/faq-item';
import { FAQITEMS } from './model/faq-items';
import { ReplaySubject } from 'rxjs';

@Component({
    selector: 'app-home-page-faq',
    templateUrl: './faq.component.html',
    styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {

    public faqItems$ = new ReplaySubject<FaqItem>();

    public ngOnInit(): void {
        FAQITEMS.forEach(item => this.faqItems$.next(item));
    }
}
