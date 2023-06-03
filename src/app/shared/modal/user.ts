export class UserModal {
  constructor(
    public username: string,
    public email: string,
    public uid: string,
    public image: string,
    public quizzes: string[],
    public customImage?: string
  ) { }
}
