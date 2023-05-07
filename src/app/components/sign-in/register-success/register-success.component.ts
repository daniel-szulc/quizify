import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-register-success',
  templateUrl: './register-success.component.html',
  styleUrls: ['./register-success.component.sass', '../sign-in.component.sass']
})
export class RegisterSuccessComponent{
constructor(public router: Router) {
}
}
