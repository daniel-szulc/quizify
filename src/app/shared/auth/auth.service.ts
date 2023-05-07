import {Injectable, Injector, NgZone} from '@angular/core';
import * as auth from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import {UsersService} from "../users.service";
import firebase from "firebase/compat";
import FirebaseError = firebase.FirebaseError;
import {UserModal} from "../modal/user";
import User = firebase.User;
import {createUserWithEmailAndPassword} from "@angular/fire/auth";
import {map} from "rxjs/operators";
import {lastValueFrom} from "rxjs";
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: any;
  user: UserModal | undefined;
  constructor(
    public afAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone, // NgZone service to remove outside scope warning
    private injector: Injector,
  ) {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        if(!this.user)
        {
          const usersService = this.injector.get(UsersService)
          usersService.isUserExists(user.uid).subscribe(r =>
            {
              if(r)
              {
               usersService.getUsername(user.uid).subscribe(username => {
                 this.saveUser(username, user);
               })
              }
              else
              {
               usersService.generateUsername(user.email || "quizifyer").subscribe(username => {
                  this.saveUser(username, user);
               });
              }
            }
          )
        }
      } else {
        localStorage.setItem('user', 'null');
      }
    });
  }
  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null ? true : false;
  }

  saveUser(username: string, user: User){
    const currentUser = JSON.parse(localStorage.getItem('user')!);
    this.userData = user.toJSON();
    if(currentUser)
      this.userData = {...currentUser, ...user.toJSON()};
    if(username)
      this.userData = {...this.userData, username: username };
    else if(currentUser)
      username = currentUser.username;
    if(!this.userData.photoURL) {
      if(currentUser)
        if(currentUser?.photoURL)
          this.userData = {...this.userData, photoURL: currentUser.photoURL};
      else
        this.userData = {...this.userData, photoURL: this.getImage(this.userData)};

    }
    localStorage.setItem('user', JSON.stringify(this.userData));
    this.CreateUser(user, user.email || "", username)
  }

  getImage(user: any){
    console.log(user)
    let photoURL = user["photoURL"];
    console.log("PHOTO URL: " + photoURL)
    if(!photoURL)
    {
      if(this.user)
        if(this.user.image)
            return this.user.image;
      const currentUser = JSON.parse(localStorage.getItem('user')!);
      if (currentUser.photoURL)
        return currentUser.photoURL

      let randomNumber: number = Math.floor(Math.random() * 21);
      let formattedNumber: string = randomNumber.toString().padStart(2, '0');
      photoURL = `assets/avatars/avatar_${formattedNumber}.jpg`;
    }
    return photoURL;
  }

  CreateUser(user: User | null, email: string, username: string){
    if(user) {
      this.user = new UserModal(username, email, user.uid, this.getImage(user), [])

      const usersService = this.injector.get(UsersService)
      usersService.sendUsersData(this.user);
    }
  }

  // Sign in with Google
  GoogleAuth() {
    return this.AuthLogin(new auth.GoogleAuthProvider());
  }
  // auth logic to run auth providers
  AuthLogin(provider: any) {
    return this.afAuth
      .signInWithPopup(provider)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate(['../'])
        });
      })
      .catch(() => {
      });
  }

  SendVerificationMail() {
    return this.afAuth.currentUser
      .then((user) => {
        if(user) user.sendEmailVerification();
      });
  }

  async SendPasswordResetEmail(email: string) {
    return await this.afAuth.sendPasswordResetEmail(email)
      .then(  () => {
          return true;
        },
        err => {
          return err.code;
      });
  }

  async SignUp(email: string, username: string,  password: string) {

    const usersService = this.injector.get(UsersService)

    return await lastValueFrom(usersService.isUsernameExists(username).pipe(map(async value => {
        if (value)
          return "usernameExists";
        return await this.afAuth
          .createUserWithEmailAndPassword(email, password)
          .then((result) => {
            this.CreateUser(result.user, email, username)
            this.SendVerificationMail();
            return true;
          })
          .catch((error) => {
            return error.code
          });
      }
    ))) ;
  }

  async SignIn(email: string, password: string) {
    return await this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        return true;
      })
      .catch((error) => {
        return error.code
      });
  }

  // Sign out
  SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['/']);
    });
  }
}
