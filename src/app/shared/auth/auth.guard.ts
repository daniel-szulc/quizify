import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import {MatSnackBar} from "@angular/material/snack-bar";
import {QuizCreatorComponent} from "../../components/quiz-creator/quiz-creator.component";
import {SignInComponent} from "../../components/sign-in/sign-in.component";
@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(public authService: AuthService, public router: Router, private snackBar: MatSnackBar) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.isLoggedIn !== true) {
      //window.alert('Access Denied, Login is Required to Access This Page!');
      let message = "";
      switch (next.component)
      {
        case QuizCreatorComponent:
          message = "Login is required to create quiz!"
          break;
        default:
          message = "Login is required to Access This Page!"
          break;
      }
      this.snackBar.open(message, "OK", {
        duration: 5000
      })
      this.router.navigate(['sign-in']);
    }
    return true;
  }
}
