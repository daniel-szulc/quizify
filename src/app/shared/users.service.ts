import { Injectable } from '@angular/core';

import 'firebase/auth';
import {AuthService} from "./auth/auth.service";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import firebase from "firebase/compat";
import User = firebase.User;
import {user} from "@angular/fire/auth";
import {UserModal} from "./modal/user";
import {from, mergeMap, Observable, of, switchMap, tap} from "rxjs";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(public authService: AuthService, private fireStore: AngularFirestore ) {
  }

  isUsernameExists(username: string) {
    return this.fireStore.collection('usernames').doc(username).get().pipe(map(res => {
      return res.exists;
    }))
  }


  isUserExists(userID: string){
    return this.fireStore.collection('users').doc(userID).get().pipe(map(res => {
      return res.exists;
    }));
  }

  getUsername(userID: string){
    return this.fireStore.collection('users').doc(userID).get().pipe(map(res => {
      // @ts-ignore
      return (res.exists && res.data()) ? res.data()['username'] : "";
    }));
  }


  getUserData(userID: string)
  {
    return this.fireStore.collection('users').doc(userID).get().pipe(map(res => {
      // @ts-ignore
      return (res.exists && res.data()) ? res.data() : null;
    }));
  }

  generateUsername(email: string): Observable<string> {
    const parts = email.split('@');
    let username = parts[0];

    return this.isUsernameExists(username).pipe(
      mergeMap(userExists => {
        if (!userExists) {
          return from([username]);
        }

        let newUsername: string;
        return from(
          new Observable<string>(observer => {
            let i = Math.floor(Math.random() * 10);
            const generate = () => {
              newUsername = username + i.toString();
              this.isUsernameExists(newUsername).subscribe(result => {
                if (result) {
                  i = Math.floor(Math.random() * 10);
                  generate();
                } else {
                  observer.next(newUsername);
                }
              });
            };
            generate();
          })
        );
      })
    );
  }


  sendUsersData(user: UserModal) {
    console.log("SEND DATA!!!")
    const userDocRef = this.fireStore.collection('users').doc(user.uid);

    const data = {
      "username": user.username,
      "image": user.image,
      "quizzes": user.quizzes
    }
    userDocRef.get().subscribe(docSnapshot => {
      if (docSnapshot.exists) {
        userDocRef.update(data);
      } else {
        userDocRef.set(data, { merge: true });
      }
    });

   if(user.username==undefined)
     return;


    const userDocNamesRef = this.fireStore.collection('usernames').doc(user.username);

    const nameData=  {"uid": user.uid}


    userDocNamesRef.get().subscribe(docSnapshot => {
      if (docSnapshot.exists) {
        console.log("exists")
        userDocNamesRef.update(nameData);
      } else {
        console.log("set")
        userDocNamesRef.set(nameData, { merge: true });
      }
    });

  }


}
