import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';

import { SubmissionOptions, SubmissionService } from '../../../admin/body/admin/submission.service';
import { MzToastService } from 'ng2-materialize';

import { CanadianProvince, CANADIANPROVINCES, CustomValidators, FormInputPostProcessors } from '../helper';
import { AppConfigService } from '../../../../config/app-config.service';
import { ReplaySubject } from 'rxjs';
import { Router } from '@angular/router';

const MAX_CHILDREN = 5; // CANIMPROVE: get this from some configuration var?

@Component({
    selector: 'app-home-page-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

    public provinces: CanadianProvince[] = CANADIANPROVINCES;
    public readonly maxChildren: number = MAX_CHILDREN;

    public childForm: FormGroup;

    public submissionInProgress = false;

    private _serverUrl$ = new ReplaySubject<string>(1);

    constructor(private _router: Router,
                private _formBuilder: FormBuilder,
                private _submissionService: SubmissionService,
                private _toastService: MzToastService,
                private _appConfigService: AppConfigService) {
        this._appConfigService.appConfig$.subscribe(config => {
            if (config.serverUrl) {
                this._serverUrl$.next(config.serverUrl);
            } else {
                console.error('No `serverUrl` was configured. Cannot access data from server.');
            }
        });
    }

    ngOnInit() {
        // Create the form
        this.childForm = this._formBuilder.group({
            parent: this._formBuilder.group({
                first_name: ['', Validators.required],
                last_name: ['', Validators.required],
                address: this._formBuilder.group({
                    street: ['', Validators.required],
                    city: ['', Validators.required],
                    province: ['', Validators.required],
                    postal_code: ['', [Validators.required, CustomValidators.postal_code]],
                }),
                phone: ['', [Validators.required, CustomValidators.phone]],
                email: ['', [Validators.required, Validators.email]],
                is_photo_allowed: [true, Validators.required], // apply the same for all children
                is_photo_public_use_allowed: [true, Validators.required], // apply the same for all children
            }),
            emergency: this._formBuilder.group({
                first_name: ['', Validators.required],
                last_name: ['', Validators.required],
                relationship: ['', Validators.required],
                phone: ['', [Validators.required, CustomValidators.phone]],
            }),
            children: this._formBuilder.array([]),
        });
        this.addChild(); // keep one child form ready

        // Apply validator observers for each control
        for (let group in this.childForm.controls) {
            CustomValidators.applyControlChangesValidationHandler(this.childForm.controls[group]);
        }

        // We want the photo allowed and public use checkboxes to be linked such that
        // when the photo allowed one is unchecked, the public use one is automatically
        // disabled; and is reenabled upon checking.
        this.childForm.get('parent').get('is_photo_allowed').valueChanges.subscribe((value: boolean) => {
            const linkedControl = this.childForm.get('parent').get('is_photo_public_use_allowed');

            const formState = ({ value: false, disabled: true });
            if (value) {
                formState.value = true;
                formState.disabled = false;
            }

            linkedControl.reset(formState);
        });
    }

    get childrenArray(): FormArray {
        return this.childForm.get('children') as FormArray;
    }

    addChild(): void {
        if (this.childrenArray.length >= MAX_CHILDREN) {
            return;
        }

        // Create a new child form group
        const newChildGroup: FormGroup = this._formBuilder.group({
            first_name: ['', Validators.required],
            last_name: ['', Validators.required],
            dob: ['', Validators.required],
            grade: ['', Validators.required],
            shirt_size: ['', Validators.required],
            medical_info: ['', Validators.maxLength(900)],
        });

        // Apply validator observers for each control
        CustomValidators.applyControlChangesValidationHandler(newChildGroup);

        // Add the new control to the array
        this.childrenArray.push(newChildGroup);

        // Initialize the datepicker for the DOB control
        // We assume that jQuery is loaded in this project
        // CANIMPROVE: Still not perfect...race condition with the actual creation of the object in the DOM...
        setTimeout(function () {
            $(`.datepicker`).pickadate({
                selectMonths: true, // Creates a dropdown to control month
                selectYears: 30,
                // We need to update the form model explicitly here, as the pickadate
                // widget works a bit differently than the standard HTML5 datepicker element
                onClose: function (val) {
                    newChildGroup.get('dob').setValue(this.get());
                }
            });
        }, 450); // timeout is SUPER hacky...FIX THIS
    }

    deleteChild(index: number): void {
        if (this.childrenArray.length <= 1) {
            return;
        }

        this.childrenArray.removeAt(index);
    }

    onSubmit(): void {
        this._serverUrl$.subscribe(url => {
            this.submissionInProgress = true;

            // Construct submissions based on the number of children in the form model, then
            // send over to the server to be stored in the DB
            const formData = this.childForm.value;
            const totalSubmissions = formData.children.length;
            let i = 0;
            formData.children.forEach(child => {
                const submission = {};

                // Parent
                for (let prop in formData.parent)
                    if (['address',
                        'is_photo_allowed',
                        'is_photo_public_use_allowed',
                    ].find(el => prop === el))
                        submission[prop] = formData.parent[prop];
                    else
                        submission[`parent_${prop}`] = formData.parent[prop];

                // Emergency
                for (let prop in formData.emergency)
                    submission[`emergency_${prop}`] = formData.emergency[prop];

                // Child
                for (let prop in child)
                    submission[prop] = child[prop];

                // Clean the input just before submitting
                submission['parent_phone'] = FormInputPostProcessors.phone(submission['parent_phone']);
                submission['emergency_phone'] = FormInputPostProcessors.phone(submission['emergency_phone']);
                submission['address']['postal_code'] = FormInputPostProcessors.postal_code(submission['address']['postal_code']);

                // Submit away!
                const name = `${submission['first_name']} ${submission['last_name']}`;
                const toastOptions = {
                    class: `green`,
                    message: `Your child ${name} has been successfully registered for VBS!`
                }; // assume success by default
                const toastDelay = 10;
                this._submissionService.putSubmission(new SubmissionOptions(url, 'child', {
                    data: submission
                }))
                    .then((data) => {
                        if (data.is_in_waiting_list &&
                            (data.is_in_waiting_list.toString().toLowerCase() == 'yes' ||
                                data.is_in_waiting_list.toString().toLowerCase() == 'true')
                        ) {
                            toastOptions.class = `orange`;
                            toastOptions.message = `We're full...but do not despair! Your child ${name} has been registered on our waiting list. We will promptly contact you if more room is made available.`;
                            return Promise.resolve();
                        }
                    })
                    .catch(err => {
                        console.error(`Failed to put submission into the server: ${err}`);

                        toastOptions.class = `red`;
                        toastOptions.message = `Oops, we were unable to process the registration of your child ${name}. Please try again later!`;
                    })
                    // finally, notify the user of the result
                    .then(() => {
                        this._toastService.show(toastOptions.message, toastDelay * 1000, toastOptions.class);

                        i++;

                        // Special handling for the very last submission
                        if (i == totalSubmissions) {
                            this.submissionInProgress = false;

                            this._toastService.show(`All done! You will be automatically redirected to the homepage in ${toastDelay} seconds...`, toastDelay * 1000, 'blue');
                            setTimeout(() => this._router.navigateByUrl('/'), toastDelay * 1000);
                        }
                    });
            });
        });
    }
}
