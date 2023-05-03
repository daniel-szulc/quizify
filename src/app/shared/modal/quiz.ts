import {QuestionModal} from "./question";

export class QuizModal {
  constructor(
    public id: string,
    public questions: QuestionModal[],
    public imageName: string,
    public category: Category,
    public authorId: string
  ){}

}
