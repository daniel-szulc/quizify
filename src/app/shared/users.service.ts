import { Injectable } from '@angular/core';

import 'firebase/auth';
import {AuthService} from "./auth/auth.service";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import firebase from "firebase/compat";
import {UserModal} from "./modal/user";
import {first, from, mergeMap, Observable, of, switchMap, take, tap} from "rxjs";
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
    console.log("sendUsersData")
    const userDocRef = this.fireStore.collection('users').doc(user.uid);
      let data = {
        "username": user.username,
        "image": user.image,
        "quizzes": user.quizzes
      }

    userDocRef.get().pipe(first()).subscribe(docSnapshot => {
      if (docSnapshot.exists) {
        if(!user.quizzes || user.quizzes.length==0) {
          this.getUserData(user.uid).pipe(take(1)).subscribe(user => {
              if (user) { // @ts-ignore
                data.quizzes = user.quizzes;
              }
              console.log(data)
              userDocRef.update(data);
            }
          )
        }
        else
          userDocRef.update(data);
      } else {
        userDocRef.set(data, { merge: true });
      }
    });

   if(user.username==undefined)
     return;


    const userDocNamesRef = this.fireStore.collection('usernames').doc(user.username);

    const nameData=  {"uid": user.uid}


    userDocNamesRef.get().pipe(first()).subscribe(docSnapshot => {
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
