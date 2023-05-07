import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {FormControl, Validators} from "@angular/forms";
import {validateEmail, validatePassword, validateUsername} from "../validation";
import {AuthService} from "../../../shared/auth/auth.service";
import {errorMessages} from "../../../shared/utils/errors.config";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.sass', '../sign-in.component.sass']
})
export class ForgotPasswordComponent {
  email = new FormControl('', [Validators.required, Validators.email]);
  mainErrorMessage="";

  successfullySent = false;
  constructor(public authService: AuthService,  public router: Router) {
  }

  submitForm() {

    if (this.email.value == null) {
      return;
    }
    if (this.email.invalid) {
      return;
    }

    this.authService.SendPasswordResetEmail(this.email.value).then(value => {
      if(value && typeof value == "boolean")
      {
        this.successfullySent = true;
      }
      else {
        console.log(value)
        this.mainErrorMessage = errorMessages[value] || 'An unexpected error occurred. Please try again.';
      }
    })

  }

  getErrorMessage(formControl: FormControl): string {
      return validateEmail(formControl);
  }

}
