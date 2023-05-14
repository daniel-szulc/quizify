/*export class CategoryModal {
  constructor(
    public name: string,
    public quizzes: string[],
    public icon: string,
  ){}
}*/

import {PromoQuizModal} from "./promoQuiz";

export interface CategoryModal {
    name: string;
    quizzes: string[];
    icon: string;
    promoQuiz?: PromoQuizModal
}

/*export {CategoryModal}*/
