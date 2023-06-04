import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import {UsersService} from "../users.service";
import {MatSnackBar} from "@angular/material/snack-bar";
@Injectable({
  providedIn: 'root',
})
export class SecureInnerPagesGuard {
  constructor(public authService: AuthService, public router: Router, private snackBar: MatSnackBar) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.isLoggedIn) {

      this.snackBar.open('Access denied!', "OK", {
        duration: 5000
      })
      this.router.navigate(['user-profile']);
    }
    return true;
  }
}
