import { Injectable } from '@angular/core';

import 'firebase/auth';
import {AuthService} from "./auth/auth.service";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import firebase from "firebase/compat";
import User = firebase.User;

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(public authService: AuthService, private fireStore: AngularFirestore ) {
console.log("UsersService")
    this.authService.afAuth.authState.subscribe((user) => {
      if (user) {
        this.sendUsersData(user);
      }
    });
  }

  sendUsersData(user: User) {
    const userDocRef = this.fireStore.collection('userData').doc(user.uid);

    userDocRef.get().subscribe(docSnapshot => {
      if (docSnapshot.exists) {
        userDocRef.update({
          "username": user.displayName,
          "image": user.photoURL
        });
      } else {
        userDocRef.set({
          "username": user.displayName,
          "image": user.photoURL
        }, { merge: true });
      }
    });
  }


}
