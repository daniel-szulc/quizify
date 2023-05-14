import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import {QuizService} from "../../shared/quiz.service";

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.sass']
})
export class ResultComponent implements OnInit {

  resultAnswers:Array<any>[] = [];

  userDetails: any;
  isSubmitted: boolean = false;

  constructor(public quizService: QuizService, private router: Router, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.quizService.correctAnsCount = 0;
    this.getAnswers();
  }

  getAnswers() {
    if (this.quizService.questionData) {
      this.quizService.questionData.filter((question, i)=> {

        if (question.answer === this.quizService.answers[i]) {
          this.quizService.correctAnsCount++;
        }
      })
    }
  }

  openSnackbar(message: any) {
    this._snackBar.open(message, 'close', {
      duration: 3000
    });
  }

  filteredResult() {
    if (this.quizService.questionData.length) {
      const userId = this.userDetails.id;
      const questionData = this.quizService.questionData;
      const timeTaken = this.quizService.displayTimeElapsed();
      const score = this.quizService.correctAnsCount * 10;
      if (userId && questionData.length && timeTaken && score >= 0) {
        const finalData = {
          time: timeTaken,
          questionData: questionData,
          score: score + '/' + (this.quizService.questionData.length * 10)
        }
        return { userId, finalData }
      }
      else {
        return null;
      }
    }
    return null;
  }

  submit() {
    this.isSubmitted = true;
    const filteredData = this.filteredResult();
    if (!filteredData) {
      this.isSubmitted = false;
      return null;
    }
    return null;
/*    this.quizService.sendResult(filteredData.userId, filteredData.finalData)
      .then(() => {
        this.openSnackbar('You results are submitted!!');
        this.isSubmitted = false;
      })
      .catch(err => {
        this.openSnackbar(err.message);
        this.isSubmitted = false;
      });*/
  }

  retry() {
    this.router.navigate(['/quiz']);
  }

}
