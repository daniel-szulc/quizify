import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {AngularFirestore} from "@angular/fire/compat/firestore";

import {map} from "rxjs/operators";
import {CategoryModal} from "./modal/category";
import {QuizModal} from "./modal/quiz";

import {QuestionModal} from "./modal/question";
import {of} from "rxjs";


@Injectable({
  providedIn: 'root'
})

export class CategoryService {

  categories: CategoryModal[] = [];

  constructor(private http: HttpClient, private fireStore: AngularFirestore, public router: Router) {

  }


  getCategories(){

    if (this.categories.length>0) {
      return of(this.categories);
    } else {
      return this.fireStore.collection('categories').get().pipe(
        map(res => {
          this.categories = res.docs.map(doc => doc.data()) as CategoryModal[];
          return this.categories;
        })
      );
    }

  }
}
