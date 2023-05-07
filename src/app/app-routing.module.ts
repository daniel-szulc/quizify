import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SecureInnerPagesGuard} from "./shared/auth/secure-inner-pages.guard";
import {AuthGuard} from "./shared/auth/auth.guard";
import {UserProfileComponent} from "./components/user-profile/user-profile.component";
import {SignInComponent} from "./components/sign-in/sign-in.component";
import {HomeComponent} from "./components/home/home.component";
import {RegisterSuccessComponent} from "./components/sign-in/register-success/register-success.component";
import {ForgotPasswordComponent} from "./components/sign-in/forgot-password/forgot-password.component";

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full'
  },
  { path: 'account',
    component: UserProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'sign-in',
    component: SignInComponent,
    canActivate: [SecureInnerPagesGuard],
  },
  {
    path: 'sign-in/forgot',
    component: ForgotPasswordComponent,
    canActivate: [SecureInnerPagesGuard],
  },
  {
    path: 'sign-in/register-complete',
    component: RegisterSuccessComponent
  },

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
