import {Component, Input} from '@angular/core';
import {AuthService} from "../../../shared/auth/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-create-success',
  templateUrl: './create-success.component.html',
  styleUrls: ['../quiz-creator.component.sass', './create-success.component.sass']
})
export class CreateSuccessComponent {
  constructor(public router: Router) {}

  @Input() quizId: string | undefined;

  copied: boolean = false;


  getQuizUrl(){
    const baseUrl = window.location.origin;
    return `${baseUrl}/quiz?id=${this.quizId}`;
  }

  shareQuiz() {
    this.copied = true;
    this.copyToClipboard(this.getQuizUrl());
  }

  copyToClipboard(text: string) {

    if (!navigator.clipboard){
      const input = document.createElement('input');
      input.style.position = 'fixed';
      input.style.opacity = '0';
      input.value = text;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
    } else{
      navigator.clipboard.writeText(text).then(
        function(){
          alert("yeah!"); // success
        })
        .catch(
          function() {
            alert("err"); // error
          });
    }
  }
}
