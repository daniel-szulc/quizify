import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {AngularFirestore} from "@angular/fire/compat/firestore";

import {map} from "rxjs/operators";
import {CategoryModal} from "./modal/category";
import {QuizModal} from "./modal/quiz";

import {QuestionModal} from "./modal/question";


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

  constructor(private http: HttpClient, private fireStore: AngularFirestore, public router: Router) {

  }


  createQuiz(data: QuizModal){
    this.fireStore.collection('quizzes').add(data).then(res =>{
      console.log(res)
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
