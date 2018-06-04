import { Component, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { SubmissionOptions, SubmissionService } from '../../../../submission/submission.service';
import { MzToastService } from 'ng2-materialize';

import { AREASOFINTEREST, CanadianProvince, CANADIANPROVINCES, CustomValidators, FormInputPostProcessors } from '../helper';
import { Router } from '@angular/router';

@Component({
    selector: 'app-volunteer',
    templateUrl: './volunteer.component.html',
    styleUrls: ['./volunteer.component.css']
})
export class VolunteerComponent implements OnInit, OnChanges {

    public readonly provinces: CanadianProvince[] = CANADIANPROVINCES;
    public readonly aoi: string[] = AREASOFINTEREST;

    public volunteerForm: FormGroup;

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

    ngOnChanges() {
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
        const toastOptions = {
            class: `green`,
            message: `You, ${name}, have successfully signed up to be a crew member for VBS 2017!`
        }; // assume success by default
        const toastDelay = 10;
        this.submissionService.putSubmission(new SubmissionOptions('http://localhost:3000', 'volunteer', {
            data: submission
        }))
            .catch(err => {
                console.error(`Failed to put submission into the server: ${err}`);

                toastOptions.class = `red`;
                toastOptions.message = `Oops, we were unable to process your volunteer registration, ${name}. Please try again later!`;
            })
            // finally, notify the user of the result
            .then(() => {
                this.toastService.show(toastOptions.message, toastDelay * 1000, toastOptions.class);
                this.submissionInProgress = false;
                this.toastService.show(`All done! You will be automatically redirected to the homepage in ${toastDelay} seconds...`, toastDelay * 1000, 'blue');
                setTimeout(() => this._router.navigateByUrl('/'), toastDelay * 1000);
            });
    }
}
