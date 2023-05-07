import {ERROR_MESSAGES} from "./form-errors.config";
import {FormControl} from "@angular/forms";

export function validateEmail(formControl: FormControl): string {
  if (formControl.hasError('required')) {
    return ERROR_MESSAGES.email.required;
  }
  return formControl.hasError('email') ? ERROR_MESSAGES.email.invalid : '';
}

export function validatePassword(formControl: FormControl): string {
  if (formControl.hasError('required')) {
    return ERROR_MESSAGES.password.required;
  }
  return formControl.hasError('minlength') ? ERROR_MESSAGES.password.tooShort : '';
}

export function validateUsername(formControl: FormControl): string {
  if (formControl.hasError('required')) {
    return ERROR_MESSAGES.username.required;
  }
  if (formControl.hasError('maxLength')) {
    return ERROR_MESSAGES.username.tooLong;
  }
  if (formControl.hasError('usernameExists')) {
    return ERROR_MESSAGES.username.alreadyExists;
  }
  return formControl.hasError('minlength') ? ERROR_MESSAGES.username.tooShort : '';
}
