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

const categories = [
  {
    "name": "Movie and TV",
    "id": "movie-tv",
    "icon": "film",
    promoQuiz: {
      title: "The Marvel Universe",
      subtitle: "Are you a real fan of superheroes? Test your knowledge of the Marvel Cinematic Universe!",
      buttonText: "Accept the challenge!",
      quizId: "",
      background: "radial-gradient( circle farthest-corner at 10% 20%,  rgba(255,0,49,1) 0%, rgba(255,41,142,1) 92% )"
    }
  },
  {
    "name": "Geography",
    "id": "geography",
    "icon": "globe-americas",
    promoQuiz: {
      title: "Globe Trotter",
      subtitle: "How well do you know our world? Put your geography skills to the test!",
      buttonText: "Start your journey!",
      quizId: "",
      background: "linear-gradient(62deg, #FBAB7E 0%, #F7CE68 100%)"
    }
  },
  {
    name: "History",
    id: "history",
    icon: 'hourglass-bottom',
    promoQuiz: {
      title: "Through the Ages",
      subtitle: "Fancy yourself a historian? Assess your knowledge of world history!",
      buttonText: "Step into the past!",
      quizId: "",
      background: "linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)"
    }
  },
  {
    name: "Book",
    id: "book",
    icon: 'book'
  },
  {
    name: "History",
    id: "history",
    icon: 'hourglass-bottom',
    promoQuiz: {
      title: "Through the Ages",
      subtitle: "Fancy yourself a historian? Assess your knowledge of world history!",
      buttonText: "Step into the past!",
      quizId: "",
      background: "linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)"
    }
  },
  {
    name: "Science",
    id: "science",
    icon: "flask"
  },
  {
    name: "Art",
    id: "art",
    icon: "palette"
  },
  {
    name: "Technology",
    id: "technology",
    icon: "laptop"
  },
  {
    "name": "Geography",
    "id": "geography",
    "icon": "globe-americas",
    promoQuiz: {
      title: "Globe Trotter",
      subtitle: "How well do you know our world? Put your geography skills to the test!",
      buttonText: "Start your journey!",
      quizId: "",
      background: "linear-gradient(62deg, #FBAB7E 0%, #F7CE68 100%)"
    }
  },
  {
    "name": "Sport",
    "id": "sport",
    "icon": "futbol"
  },
  {
    "name": "Game",
    "id": "game",
    "icon": "joystick"
  },
  {
    "name": "Animal",
    "id": "animal",
    "icon": "paw"
  },
  {
    "name": "Motorsports",
    "id": "motorsports",
    "icon": "car"
  },
  {
    "name": "Celebrities",
    "id": "celebrities",
    "icon": "star"
  },
  {
    "name": "Anatomy",
    "id": "anatomy",
    "icon": "brain"
  },

];

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

  constructor(private authService: AuthService, private http: HttpClient, private fireStore: AngularFirestore, public router: Router) {
   //this.createCategories()

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
        console.log(quizId)
        console.log(quiz)

        // Remove the quizId from the 'quizzes' array in the category document

        console.log("categories")

        const categoryRef = this.fireStore.collection('categories').doc(quiz.categoryId).ref;
        console.log("categories")


        await categoryRef.update({
          quizzes: firebase.firestore.FieldValue.arrayRemove(quizId)
        });
          console.log("categories success")



        // Remove the quizId from the 'quizzes' array in the user document
        const userRef = this.fireStore.collection('users').doc(quiz.authorId).ref;
        await userRef.update({
          quizzes: firebase.firestore.FieldValue.arrayRemove(quizId)
        });
        console.log("users")

        await this.fireStore.collection('quizzes').doc(quizId).delete();
        console.log("quizzes")
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
