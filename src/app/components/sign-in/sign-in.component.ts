import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/auth/auth.service';
import {FormControl, Validators} from '@angular/forms';
import {faEye, faEyeSlash} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.sass'],
})
export class SignInComponent implements OnInit {
  faEye = faEye
  faEyeSlash = faEyeSlash
  email = new FormControl('', [Validators.required, Validators.email]);
  password =  new FormControl('', [Validators.required, Validators.minLength(8)]);
  username =  new FormControl();
  hidePassword = true;
  isRegister = false;
  getErrorMessage(form: FormControl) {

    switch (form){
      case this.email: {
        if (this.email.hasError('required')) {
          return 'You must enter a value';
        }
        return this.email.hasError('email') ? 'Invalid email address.' : '';
      }
      case this.password: {
        if (this.password.hasError('required')) {
          return 'You must enter a value';
        }
        return this.password.hasError('minlength') ? 'Password must be at least 8 characters long.' : '';
      }
    }
    return '';
  }

  forgotPassword(){

  }

  submitForm(){

  }
  constructor(public authService: AuthService) {}
  ngOnInit() {}


}
