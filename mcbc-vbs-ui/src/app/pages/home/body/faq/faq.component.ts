import { Component, OnInit } from '@angular/core';

import { FaqItem } from './model/faq-item';
import { FAQITEMS } from './model/faq-items';
import { Observable, of } from 'rxjs';

@Component({
    selector: 'app-home-page-faq',
    templateUrl: './faq.component.html',
    styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {
    public faqItems$: Observable<Array<FaqItem>>;

    public ngOnInit(): void {
        this.faqItems$ = of(FAQITEMS);
    }
}
