import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from "../../shared/auth/auth.service";
import {NavigationEnd, Router} from "@angular/router";
import {filter, map} from 'rxjs/operators';
import { faPlus, faUser, faRightFromBracket} from "@fortawesome/free-solid-svg-icons";
import {first} from "rxjs";

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
  username = ""
  profileImgUrl=""
  constructor(private authService: AuthService,  public router: Router) {


  }

  getUsername() {
    return this.authService.user?.username;
  }
  getImage() {
    return this.authService.getImage();
  }


  ngOnInit() {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event: NavigationEnd) => event.url)
    ).pipe(first()).subscribe((url: string) => {
      this.isSignInPage = url == '/sign-in';
    });
  }

  onSignOut() {
    this.authService.SignOut();
  }

  get isLoggedIn() {
    return this.authService.isLoggedIn;
  }
}
