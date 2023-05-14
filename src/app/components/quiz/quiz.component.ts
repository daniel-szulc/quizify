import {Component, OnInit, HostBinding, HostListener} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import { MatRadioChange } from '@angular/material/radio';
import {QuizService} from "../../shared/quiz.service";
import {QuestionModal} from "../../shared/modal/question";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import { Location } from '@angular/common'
import {QuizModal} from "../../shared/modal/quiz";

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.sass']
})
export class QuizComponent implements OnInit {

  faArrowLeft = faArrowLeft;
  selectedAnswer: number = 0;
  isLoading: Boolean = false;
  quizID: string = "";
  isQuizNotFound = false;

  constructor(private route: ActivatedRoute, public quizService: QuizService, public sanitizer: DomSanitizer, public router: Router, private location: Location) { }

  ngOnInit(): void {

    this.route.queryParams
      .subscribe(params => {
          this.quizID = params['id'];
          this.getQuizData(this.quizID);
        }
      );
    this.quizService.qnProgress = 0;
    this.quizService.seconds = 0;


    // this.quizService.addData({ answer: 0, imageName: " ", options: ["True", "False"], question: "Is 'undefined' a data type in javascript?" });
  }

  public get valueAsStyle(): any {
    return this.sanitizer.bypassSecurityTrustStyle(`--progress-bar: ${this.getProgressValue}%`);
  }

  @HostListener('window:beforeunload')
  preventNavigation() {
    return this.quizService.qnProgress <= 0;
  }

  back(): void {
    this.location.back()
  }
  // Check prev available
  public get checkPrev(): Boolean {
    if (this.quizService.qnProgress - 1 >= 0) {
      return true;
    }
    return false;
  }

  // Check next available
  public get checkNext(): Boolean {
   return false

  }

  // Get Progress Value
  public get getProgressValue() {
    const progressValue = (this.quizService.qnProgress + 1) * (100 / this.quizService.questionData.length);
    return progressValue;
  }

  // Check if the radio is select or not
  // isRadioChecked(index: number) {
  //   if (this.quizService.questionData[this.quizService.qnProgress].participantAnswer === index) {
  //     return true;
  //   }
  //   return false;
  // }

  // To filter the data
  filterData(id: string, data: any) {
    return {
      id: id,
      answer: data.answer,
      imageName: data.imageName,
      options: data.options,
      question: data.question,
      participantAnswer: -1
    }
  }

  // Getting quiz data
  getQuizData(quizID: string) {
  //  this.quizService.sendData()
    this.isLoading = true;

    this.quizService.getQuizData(quizID).subscribe(
      res => {

        const quiz: QuizModal = res as QuizModal;

        this.isLoading = false;
        if(!quiz)
        {
          this.isQuizNotFound=true;
          return;
        }
        const filteredData: QuestionModal[] =  quiz.questions;
        this.quizService.questionData = filteredData;
        this.startTimer();
      }
    );
  }

  // Start timer
  startTimer() {
    // @ts-ignore
    this.quizService.timer = setInterval(() => {
      this.quizService.seconds++;
    }, 1000)
  }

  // Submit answer or click next
/*
  clickNextBtn(id: any) {
    if (this.checkNext) {
      this.quizService.qnProgress++;
      if (this.quizService.questionData.length == this.quizService.qnProgress) {
        // @ts-ignore
        clearInterval(this.quizService.timer);
        this.router.navigate(['/result']);
        return;
      }
    }
  }
*/

  selectAnswer(id: any){
    console.log(id);
    this.quizService.answers[this.quizService.qnProgress] = id;
    this.quizService.qnProgress++;
    if (this.quizService.questionData.length == this.quizService.qnProgress) {
      // @ts-ignore
      clearInterval(this.quizService.timer);
      this.router.navigate(['/result']);
      return;
    }
  }

  // Prev question
  clickPrevBtn() {
    if (!this.checkPrev) {
      return;
    }
    this.quizService.qnProgress--;
  }

}
