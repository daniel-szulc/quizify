import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {AngularFirestore} from "@angular/fire/compat/firestore";

import {map} from "rxjs/operators";
import {CategoryModal} from "./modal/category";
import {QuizModal} from "./modal/quiz";

import {QuestionModal} from "./modal/question";
import {AuthService} from "./auth/auth.service";
import {error} from "@angular/compiler-cli/src/transformers/util";

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

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


  async addQuizToCategory(categoryId: string, quizId: string): Promise<void> {
    const categoryRef = this.fireStore.collection('categories').doc(categoryId).ref;

    try {
      // Get the current 'quizzes' array from the category document
      const doc = await categoryRef.get();

      if (!doc.exists) {
        console.log('No such document!');
      } else {
        // If the 'quizzes' array exists, add the new quizId, otherwise create a new array with quizId
        // @ts-ignore
        const quizzes = doc.data()?.quizzes ?? [];
        quizzes.push(quizId);

        // Update the 'quizzes' array in the category document
        return categoryRef.update({ quizzes });
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
       this.addQuizToCategory(data.categoryId, res.id);
       // this.fireStore.collection('categories').doc(data.categoryId).update({
       //   quizzes: firebase.firestore.FieldValue.arrayUnion(res.id)
       // });
       return res.id
     }
     return undefined;
    }, error =>{
      return undefined;
    })

  }

/*  sendData(){

    const questionsData: QuestionModal[] = [
      {
        question: "What is 2 + 2?",
        answer: 2,
        options: ["22", "5", "4", "√13"]
      },
      {
        question: "What is 100 - 52?",
        answer: 1,
        options: ["52", "48", "46", "2"]
      },
      {
        question: "What is 10 ÷ 5?",
        answer: 0,
        options: ["2", "5", "1", "16"]
      },
      {
        question: "What is 2 × 12?",
        answer: 3,
        options: ["221", "2", "212", "24"]
      },
    ]

    const category: CategoryModal = {name: "Math", quizzes: [], icon: "math"}

    const data: QuizModal = {
      authorId: "test",
      category: category,
      questions: questionsData
    }


    this.fireStore.collection('quizzes').add(data).then(res =>{
      console.log(res)
    })

  }*/

  // Timer
  displayTimeElapsed() {
    const minutes = Math.floor(this.seconds / 60) < 10 ? '0' + Math.floor(this.seconds / 60) : Math.floor(this.seconds / 60);
    const seconds = Math.floor(this.seconds % 60) < 10 ? '0' + Math.floor(this.seconds % 60) : Math.floor(this.seconds % 60);
    return `${minutes} : ${seconds}`;
  }

  getQuizData(quizID: string) {

    return this.fireStore.collection('quizzes').doc(quizID).get().pipe(map(res => {
      // @ts-ignore
      return (res.exists && res.data()) ? res.data() as QuizModal : null;
    }));
  }

  signOut() {
    localStorage.clear();
    // @ts-ignore
    clearInterval(this.timer);
    this.router.navigate(['/']);
  }
}
