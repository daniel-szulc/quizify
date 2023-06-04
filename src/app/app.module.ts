import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {CommonModule} from "@angular/common";
import {AngularFirestoreModule} from "@angular/fire/compat/firestore";
import {environment} from "../environments/environments";
import {AngularFireModule} from "@angular/fire/compat";
import {HttpClientModule} from "@angular/common/http";
import {AngularFireAuthModule} from "@angular/fire/compat/auth";
import {AngularFireStorageModule} from "@angular/fire/compat/storage";
import {AngularFireDatabaseModule} from "@angular/fire/compat/database";
import { SecureInnerPagesGuard } from './shared/auth/secure-inner-pages.guard';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import {AuthService} from "./shared/auth/auth.service";
import {AuthGuard} from "./shared/auth/auth.guard";
import {UsersService} from "./shared/users.service";
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import {MaterialModule} from "./modules/material.module";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from "@angular/material/form-field";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RegisterSuccessComponent } from './components/sign-in/register-success/register-success.component';
import { ForgotPasswordComponent } from './components/sign-in/forgot-password/forgot-password.component';
import {QuizComponent} from "./components/quiz/quiz.component";
import {ResultComponent} from "./components/result/result.component";
import {CarouselComponent} from "./components/carousel/carousel.component";
import {CarouselCategoryComponent} from "./components/carousel-category/carousel-category.component";
import { NgxBootstrapIconsModule, allIcons } from 'ngx-bootstrap-icons';
import {CarouselSlidesComponent} from "./components/carousel-slides/carousel-slides.component";
import {NgbCarousel, NgbModule, NgbPaginationModule} from "@ng-bootstrap/ng-bootstrap";
import {QuizCreatorComponent} from "./components/quiz-creator/quiz-creator.component";
import {FormsModule} from "@angular/forms";
import { CreateSuccessComponent } from './components/quiz-creator/create-success/create-success.component';
import { CategoryComponent } from './components/category/category.component';
import {ClipboardService} from "./shared/clipboard.service";


@NgModule({
    declarations: [
        AppComponent,
        SignInComponent,
        UserProfileComponent,
        HomeComponent,
        NavbarComponent,
        RegisterSuccessComponent,
        ForgotPasswordComponent,
        QuizComponent,
        ResultComponent,
        CarouselComponent,
        CarouselCategoryComponent,
         QuizCreatorComponent,
         CreateSuccessComponent,
         CategoryComponent
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    HttpClientModule,
    MaterialModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    NgxBootstrapIconsModule.pick(allIcons),
    NgbCarousel,
    CarouselSlidesComponent,
    NgbModule,
    FormsModule,
    NgbPaginationModule,
  ],
  providers: [
    AuthService,
    AuthGuard,
    SecureInnerPagesGuard,
    UsersService,
    ClipboardService,
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
