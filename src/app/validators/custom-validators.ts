import { FormControl, ValidationErrors } from '@angular/forms';

export class CustomValidators {

    static containsWhitespace(control :FormControl) : ValidationErrors {
        if ((control.value !=null) && (control.value.trim().length ===0)) {
            return { 'containsWhitespace' : true };
        }
        else {
            return null;
        }
    }
}
