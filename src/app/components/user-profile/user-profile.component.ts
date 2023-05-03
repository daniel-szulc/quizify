import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/auth.service';
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.sass'],
})
export class UserProfileComponent implements OnInit {
  constructor(public authService: AuthService) {}
  ngOnInit() {}

}
