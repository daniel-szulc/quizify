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
import {MaterialModule} from "./material.module";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from "@angular/material/form-field";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    UserProfileComponent,
    HomeComponent,
    NavbarComponent,
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
    FontAwesomeModule
  ],
  providers: [
    AuthService,
    AuthGuard,
    SecureInnerPagesGuard,
    UsersService,
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
