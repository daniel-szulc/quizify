import {Component, Input} from '@angular/core';
import {AuthService} from "../../../shared/auth/auth.service";
import {Router} from "@angular/router";
import {ClipboardService} from "../../../shared/clipboard.service";

@Component({
  selector: 'app-create-success',
  templateUrl: './create-success.component.html',
  styleUrls: ['../quiz-creator.component.sass', './create-success.component.sass']
})
export class CreateSuccessComponent {
  constructor(public router: Router, private clipboardService: ClipboardService) {}

  @Input() quizId: string | undefined;

  @Input() editQuizId: string | undefined;

  copied: boolean = false;


  getQuizUrl(){
    if (this.quizId)
      return this.clipboardService.getQuizUrl(this.quizId);
    return null;
  }

  shareQuiz() {
    if(this.quizId)
      this.clipboardService.copyQuizUrl(this.quizId);
  }

  goHome(){
    this.router.navigate(['/']);
  }

  takeTheQuiz(){
    this.router.navigate(['quiz/'+this.quizId]);
  }

}
