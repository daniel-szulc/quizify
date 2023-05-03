import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from '../shared/auth.service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class SecureInnerPagesGuard {
  constructor(public authService: AuthService, public router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.isLoggedIn) {
      window.alert('Access denied!');
      this.router.navigate(['user-profile']);
    }
    return true;
  }
}
