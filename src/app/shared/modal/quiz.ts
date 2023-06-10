/*import {QuestionModal} from "./question";
import {CategoryModal} from "./category";

export class QuizModal {
  constructor(
    public questions: QuestionModal[],
    public category: CategoryModal,
    public authorId: string
  ){}

}*/


import {QuestionModal} from "./question";
import {CategoryModal} from "./category";

export interface QuizModal {

     name: string;
     description: string;
     questions: QuestionModal[];
     categoryId: string;
     authorId: string;
     quizID?: string;
     authorName?: string;
     categoryName?: string;
}
