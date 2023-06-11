import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {AngularFirestore} from "@angular/fire/compat/firestore";

import {concatMap, map, toArray} from "rxjs/operators";
import {CategoryModal} from "./modal/category";
import {QuizModal} from "./modal/quiz";

import {QuestionModal} from "./modal/question";
import {AuthService} from "./auth/auth.service";
import {error} from "@angular/compiler-cli/src/transformers/util";

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import {first, from, switchMap} from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class QuizService {

  questionData: QuestionModal[] = [];

  answers: number[] = []
  seconds: number = 0;
  timer = null;
  qnProgress: number = 0;
  correctAnsCount: number = 0;
  quizId = "";
  constructor(private authService: AuthService, private http: HttpClient, private fireStore: AngularFirestore, public router: Router) {

  }



  async addQuizToCollection(collectionId: string, quizId: string, collection: string): Promise<void> {
    const userRef = this.fireStore.collection(collection).doc(collectionId).ref;

    try {
      // Get the current 'quizzes' array from the category document
      const doc = await userRef.get();

      if (!doc.exists) {
        console.log('No such document!');
      } else {
        // If the 'quizzes' array exists, add the new quizId, otherwise create a new array with quizId
        // @ts-ignore
        const quizzes = doc.data()?.quizzes ?? [];
        quizzes.push(quizId);

        return userRef.update({ quizzes });
      }
    } catch (error) {
      console.log('Error getting document:', error);
    }
  }

  createQuiz(data: QuizModal) : Promise<string | undefined> {

    if(this.authService.user)
      data = {...data, authorId: this.authService.user.uid}
    else
      data = {...data, authorId: this.authService.userData.uid}

    console.log(data)
   return this.fireStore.collection('quizzes').add(data).then(res =>{
     if(res.id)
     {
       console.log(res.id)
       //add quiz to categories collection
       this.addQuizToCollection(data.categoryId, res.id, "categories");
       //add quiz to users collection
       this.addQuizToCollection(data.authorId, res.id, "users");
       return res.id
     }
     return undefined;
    }, error =>{
      return undefined;
    })

  }

  updateQuiz(quizId: string, data: QuizModal): Promise<void> {
    if(this.authService.user)
      data = {...data, authorId: this.authService.user.uid}
    else
      data = {...data, authorId: this.authService.userData.uid}

    console.log(data);

    return this.fireStore.collection('quizzes').doc(quizId).update(data).then(() => {
      console.log(`Quiz with ID: ${quizId} updated successfully.`);
    }, error => {
      console.error('Error while updating quiz: ', error);
    });
  }

  // Timer
  displayTimeElapsed() {
    const minutes = Math.floor(this.seconds / 60) < 10 ? '0' + Math.floor(this.seconds / 60) : Math.floor(this.seconds / 60);
    const seconds = Math.floor(this.seconds % 60) < 10 ? '0' + Math.floor(this.seconds % 60) : Math.floor(this.seconds % 60);
    return `${minutes} : ${seconds}`;
  }

  getQuizData(quizID: string) {
    return this.fireStore.collection('quizzes').doc(quizID).get().pipe(map(res => {
      if (res.exists && res.data()) {
        const quizData = res.data() as QuizModal;
        quizData.quizID = quizID;
        return quizData;
      } else {
        return null;
      }
    }));
  }

  public async deleteQuiz(quizId: string): Promise<void> {

    this.getQuizData(quizId).pipe(first()).subscribe(
      async quiz => {
        if(!quiz)
          return;

        const categoryRef = this.fireStore.collection('categories').doc(quiz.categoryId).ref;



        await categoryRef.update({
          quizzes: firebase.firestore.FieldValue.arrayRemove(quizId)
        });

        const userRef = this.fireStore.collection('users').doc(quiz.authorId).ref;
        await userRef.update({
          quizzes: firebase.firestore.FieldValue.arrayRemove(quizId)
        });

        await this.fireStore.collection('quizzes').doc(quizId).delete();

      }
    )}


    getQuizzes(quizIDs: string[]) {

    if(quizIDs == undefined) null;
    return from(quizIDs).pipe(
      concatMap(quizID => this.getQuizData(quizID)),
      toArray()
    );
  }

  signOut() {
    localStorage.clear();
    // @ts-ignore
    clearInterval(this.timer);
    this.router.navigate(['/']);
  }
}
