import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SecureInnerPagesGuard} from "./shared/auth/secure-inner-pages.guard";
import {AuthGuard} from "./shared/auth/auth.guard";
import {UserProfileComponent} from "./components/user-profile/user-profile.component";
import {SignInComponent} from "./components/sign-in/sign-in.component";

const routes: Routes = [
  { path: '', redirectTo: '/sign-in', pathMatch: 'full' },
  {
    path: 'sign-in',
    component: SignInComponent,
    canActivate: [SecureInnerPagesGuard],
  },
  {
    path: 'user-profile',
    component: UserProfileComponent,
    canActivate: [AuthGuard],
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
