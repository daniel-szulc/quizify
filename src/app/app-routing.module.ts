import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SecureInnerPagesGuard} from "./shared/auth/secure-inner-pages.guard";
import {AuthGuard} from "./shared/auth/auth.guard";
import {UserProfileComponent} from "./components/user-profile/user-profile.component";
import {SignInComponent} from "./components/sign-in/sign-in.component";
import {HomeComponent} from "./components/home/home.component";
import {RegisterSuccessComponent} from "./components/sign-in/register-success/register-success.component";
import {ForgotPasswordComponent} from "./components/sign-in/forgot-password/forgot-password.component";
import {QuizComponent} from "./components/quiz/quiz.component";
import {ResultComponent} from "./components/result/result.component";
import {QuizCreatorComponent} from "./components/quiz-creator/quiz-creator.component";

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
  {
    path: 'quiz',
    component: QuizComponent
  },
  {
    path: 'quiz/:id',
    component: QuizComponent
  },
  {
    path: 'result',
    component: ResultComponent
  },
  {
    path: 'create',
    component: QuizCreatorComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'category/:id',
    component: QuizComponent
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
