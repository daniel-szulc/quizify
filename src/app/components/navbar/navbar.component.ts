import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from "../../shared/auth/auth.service";
import {NavigationEnd, Router} from "@angular/router";
import {filter, map} from 'rxjs/operators';
import { faPlus, faUser, faRightFromBracket} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass']
})
export class NavbarComponent implements OnInit{
  faPlus = faPlus
  faUser = faUser
  faRightFromBracket = faRightFromBracket

  isSignInPage = false;
  constructor(private authService: AuthService,  public router: Router) {}


  ngOnInit() {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event: NavigationEnd) => event.url)
    ).subscribe((url: string) => {
      this.isSignInPage = url == '/sign-in';
    });
  }

  onSignIn() {
    this.router.navigate(['sign-in']);
  }

  onSignOut() {
    this.authService.SignOut();
  }

  get isLoggedIn() {
    return this.authService.isLoggedIn;
  }
}
