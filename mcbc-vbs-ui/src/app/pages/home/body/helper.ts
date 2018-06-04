/// Useful types ///

export interface ToastOptions {
    class: string;
    message: string;
}

/// Provinces of Canada ///

export class CanadianProvince {
    name: string;
    shortname: string;
}

export const CANADIANPROVINCES: CanadianProvince[] = [
    { name: 'Ontario', shortname: 'ON' },
    { name: 'Alberta', shortname: 'AB' },
    { name: 'British Columbia', shortname: 'BC' },
    { name: 'Manitoba', shortname: 'MB' },
    { name: 'New Brunswick', shortname: 'NB' },
    { name: 'Newfoundland and Labrador', shortname: 'NL' },
    { name: 'Northwest Territories', shortname: 'NT' },
    { name: 'Nova Scotia', shortname: 'NS' },
    { name: 'Nunavut', shortname: 'NU' },
    { name: 'Prince Edward Island', shortname: 'PE' },
    { name: 'Quebec', shortname: 'QC' },
    { name: 'Saskatchewan', shortname: 'SK' },
    { name: 'Yukon', shortname: 'YT' }
];

/// Address class
export class Address {
    street: string;
    city: string;
    province: string;
    postal_code: string;
}

/// Areas of Interest for volunteers
export const AREASOFINTEREST: string[] = [
    'Small Group',
    'Music',
    'Arts and Crafts',
    'Snacks',
    'Sports',
    'Big Brother/Sister',
    'Photography/Video',
    'Stage Creation',
    'Registration',
    'Audio/Video',
    'First Aid',
    'Security',
];

/// Custom Validators

import { AbstractControl, Validators, ValidationErrors } from '@angular/forms';

export class CustomValidators {
    static phone(control: AbstractControl): ValidationErrors {
        if (!control.value.match(/^\s*(\d{3})[\s-]*(\d{3})[\s-]*(\d{4})\s*$/i))
            return { phone: true };
        return null;
    }

    static postal_code(control: AbstractControl): ValidationErrors {
        if (!control.value.match(/^\w\d\w\s*\d\w\d$/i))
            return { postal_code: true };
        return null;
    }

    static readonly errorMessages: { [key: string]: string } = {
        required: 'Missing required field',
        phone: 'Invalid phone number (valid example: 905-123-1234 or 416 321 4321)',
        email: 'Invalid email (valid example: abc@example.com)',
        postal_code: 'Invalid postal code (valid example: A1A 1A1)',
    };

    /// Registers handlers to the given control(s) which will update the rendered view's
    /// appropriate error message box with the appropriate validation error message (if
    /// any) in response to a change in the control's value.
    static applyControlChangesValidationHandler(abstractControl) {
        const handler = (control) => {
            let controlAny = control as any;
            controlAny.errorMessage = CustomValidators.errorMessages['required']; // it would be annoying if all required fields were
                                                                                  // initialized with the 'required' error message
            control.valueChanges.subscribe(() => {
                const errors = control.errors;
                if (!errors)
                    return controlAny.errorMessage = null;

                for (let prop in errors)
                    return controlAny.errorMessage = CustomValidators.errorMessages[prop];
            });
        };

        if (!abstractControl.controls) // this is a FormControl (a leaf)
            return handler(abstractControl);

        if (abstractControl.controls instanceof Array) // this is a FormArray
            for (let el of abstractControl.controls)
                CustomValidators.applyControlChangesValidationHandler(el);
        else // otherwise, this is a FormGroup
            for (let prop in abstractControl.controls)
                CustomValidators.applyControlChangesValidationHandler(abstractControl.controls[prop]);
    }
}

/// Pre-submission processors
// Assumption: the input has already passed through a validator
export const FormInputPostProcessors: { [key: string]: Function } = {
    phone: (phone) => phone.replace(/[\s-]/gi, ''),
    postal_code: (postal_code) => postal_code.replace(/^(\w\d\w)\s*(\d\w\d)$/i, '$1 $2').toUpperCase(),
};
