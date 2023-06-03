import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/auth/auth.service';
import {FormControl, Validators} from '@angular/forms';
import {faUser, faEnvelope, faEye, faEyeSlash} from "@fortawesome/free-solid-svg-icons";
import {faLock} from "@fortawesome/free-solid-svg-icons";

import {Router} from "@angular/router";
import {errorMessages} from "../../shared/utils/errors.config";
import { validateEmail, validatePassword, validateUsername } from './validation';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.sass'],
})
export class SignInComponent implements OnInit {
  constructor(public authService: AuthService,  public router: Router) {}
  ngOnInit() {}
  faEye = faEye
  faEyeSlash = faEyeSlash
  faEnvelope=faEnvelope
  faUser = faUser

  faLock = faLock

  email = new FormControl('', [Validators.required, Validators.email]);
  password =  new FormControl('', [Validators.required, Validators.minLength(8)]);
  username =  new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(16)]);
  hidePassword = true;
  isRegister = false;
  mainErrorMessage="";
  getErrorMessage(formControl: FormControl): string {
    if (formControl === this.email) {
      return validateEmail(formControl);
    }
    if (formControl === this.password) {
      return validatePassword(formControl);
    }
    if (formControl === this.username) {
      return validateUsername(formControl);
    }
    return '';
  }

  submitForm(){

    this.mainErrorMessage = "";

    if(this.email.value==null || this.password.value==null) {
      return;
    }
    if (this.email.invalid || this.password.invalid) {
      return;
    }
    let submitResult: Promise<any>;
    if(this.isRegister) {
      if(this.username.value==null) return;
      if(this.username.invalid) return;

      submitResult = this.authService.SignUp(this.email.value, this.username.value, this.password.value);

    }
    else {
      submitResult =  this.authService.SignIn(this.email.value, this.password.value)
    }
    console.log("submitBefore")

    submitResult.then(value =>
      {
        if(value && typeof value == "boolean")
        {
          if(this.isRegister)
          {
            // Register success
            this.router.navigate(["/sign-in/register-complete"])
          }
          else {
            // Login success
            this.router.navigate(["/"])

          }
        }
        else {
            console.log(value)
            this.mainErrorMessage = errorMessages[value] || 'An unexpected error occurred. Please try again.';
        }
      }
    )
  }



}
