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

export class CategoryService {

  constructor(private http: HttpClient, private fireStore: AngularFirestore, public router: Router) {

  }


  getCategories(){

    // return this.fireStore.collection('categories').get().pipe(map(res => {
    //   // @ts-ignore
    //   console.log(res.data());
    //   // @ts-ignore
    //   return (res.exists && res.data()) ? res.data() as string[] : null;
    // }));

     return ['Sport', 'Music', 'Chemistry', 'General', 'Technology']
  }
}
