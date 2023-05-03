import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/auth/auth.service';
import {UsersService} from "../../shared/users.service";
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.sass'],
})
export class UserProfileComponent implements OnInit {
  constructor(public authService: AuthService, public usersService: UsersService) {}
  ngOnInit() {}

}
