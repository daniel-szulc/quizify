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
import { SecureInnerPagesGuard } from './shared/secure-inner-pages.guard';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import {AuthService} from "./shared/auth.service";
import {AuthGuard} from "./shared/auth.guard";
@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    UserProfileComponent
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
  ],
  providers: [AuthService, AuthGuard, SecureInnerPagesGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
