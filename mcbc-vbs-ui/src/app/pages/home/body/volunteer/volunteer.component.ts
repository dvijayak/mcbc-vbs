import { Component, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { SubmissionOptions, SubmissionService } from '../../../../submission/submission.service';
import { MzToastService } from 'ngx-materialize';

import { AREASOFINTEREST, CanadianProvince, CANADIANPROVINCES, CustomValidators, FormInputPostProcessors, ToastOptions } from '../helper';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-volunteer',
    templateUrl: './volunteer.component.html',
    styleUrls: ['./volunteer.component.css']
})
export class VolunteerComponent implements OnInit, OnDestroy {

    public readonly provinces: CanadianProvince[] = CANADIANPROVINCES;
    public readonly aoi: string[] = AREASOFINTEREST;

    public volunteerForm: FormGroup;

    private _redirectTimer: any;

    /**
     * Used to show progress indications when posting data to the server
     */
    public submissionInProgress = false;

    constructor(private _router: Router,
                private formBuilder: FormBuilder,
                private submissionService: SubmissionService,
                private toastService: MzToastService
    ) {
    }

    ngOnInit() {
        // Create the form
        this.volunteerForm = this.formBuilder.group({
            first_name: ['', Validators.required],
            last_name: ['', Validators.required],
            shirt_size: ['', Validators.required],
            address: this.formBuilder.group({
                street: ['', Validators.required],
                city: ['', Validators.required],
                province: ['', Validators.required],
                postal_code: ['', [Validators.required, CustomValidators.postal_code]],
            }),
            phone: ['', [Validators.required, CustomValidators.phone]],
            email: ['', [Validators.required, Validators.email]],
            is_adult: [false, Validators.required],
            police_check_completed: [{ value: false, disabled: true }, Validators.required],
            ranked_aoi: ['', Validators.required],
            emergency: this.formBuilder.group({
                first_name: ['', Validators.required],
                last_name: ['', Validators.required],
                relationship: ['', Validators.required],
                phone: ['', [Validators.required, CustomValidators.phone]],
            }),
        });

        // Apply validator observers for each control
        for (let group in this.volunteerForm.controls)
            CustomValidators.applyControlChangesValidationHandler(this.volunteerForm.controls[group]);

        // We want the is adult and police check checkboxes to be linked such that when
        // the former is unchecked, the latter is automatically disabled; and is reenabled
        // upon checking.
        this.volunteerForm.get('is_adult').valueChanges.subscribe((value: boolean) => {
            const linkedControl = this.volunteerForm.get('police_check_completed');

            const formState = ({ value: false, disabled: true });
            if (value) {
                formState.disabled = false;
            }

            linkedControl.reset(formState);
        });
    }

    onSubmit(): void {
        // Construct submission and send over to the server to be stored in the DB
        const formData = this.volunteerForm.value;
        const submission = {};

        // Emergency
        for (let prop in formData.emergency)
            submission[`emergency_${prop}`] = formData.emergency[prop];

        // Volunteer
        for (let prop in formData)
            if (prop !== 'emergency')
                submission[prop] = formData[prop];

        // Clean the input just before submitting
        submission['phone'] = FormInputPostProcessors.phone(submission['phone']);
        submission['emergency_phone'] = FormInputPostProcessors.phone(submission['emergency_phone']);
        submission['address']['postal_code'] = FormInputPostProcessors.postal_code(submission['address']['postal_code']);

        // Submit away!
        const name = `${submission['first_name']} ${submission['last_name']}`;
        const toastDelay = 10;
        this.submissionService.putSubmission(new SubmissionOptions('volunteer', {
            data: submission
        }))
            .map(data => { // we assume any OK-ish response to be a success :-)
                return {
                    class: `green`,
                    message: `You, ${name}, have successfully signed up to be a crew member for VBS 2017!`
                };
            })
            .catch(err => {
                console.error(`Failed to put submission into the server: ${err}`);

                return Observable.of({ // failure :-(
                    class: `red`,
                    message: `Oops, we were unable to process your volunteer registration, ${name}. Please try again later!`
                });
            })
            .subscribe((toastOptions: ToastOptions) => {
                // Finally, notify the user of the result
                this.toastService.show(toastOptions.message, toastDelay * 1000, toastOptions.class);
                this.submissionInProgress = false;
                this.toastService.show(`All done! You will be automatically redirected to the homepage in ${toastDelay} seconds...`, toastDelay * 1000, 'blue');
                this._redirectTimer = setTimeout(() => this._router.navigateByUrl('/'), toastDelay * 1000);
            });
    }

    public ngOnDestroy(): void {
        // When the component is destroyed (ex: premature page navigation), we want to
        // cancel the redirection timer. Otherwise the page will automatically re-route against the user's desire
        clearTimeout(this._redirectTimer);
    }
}
