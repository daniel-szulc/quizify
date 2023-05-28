import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormArray, FormControl, AbstractControl} from '@angular/forms';


import {QuizModal} from "../../shared/modal/quiz";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {CategoryService} from "../../shared/category.service";
import {QuizService} from "../../shared/quiz.service";
import {Observable, startWith} from "rxjs";
import {map} from "rxjs/operators";
import {CategoryModal} from "../../shared/modal/category";
import {QuestionModal} from "../../shared/modal/question";
import {Router} from "@angular/router";

@Component({
  selector: 'app-quiz-creator',
  templateUrl: './quiz-creator.component.html',
  styleUrls: ['./quiz-creator.component.sass']
})
export class QuizCreatorComponent implements OnInit {

  // @ts-ignore
  quizForm: FormGroup;
  categories: Map<string, string> = new Map();
  filteredCategories: Observable<string[]> = new Observable<string[]>();
  lastValidCategory: string = '';
  isOpened: boolean = false;
  isLoading:boolean = true;
  isSubmitted:boolean =false;

  quizId: string | undefined;
 //categories: Observable<string[]>;
  constructor(private  router: Router, private fb: FormBuilder, private categoryService: CategoryService, private quizService: QuizService) { }

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe((categoryModals: CategoryModal[]) => {

      this.isLoading=true;

      if (!categoryModals) return;
      categoryModals.forEach(categoryModal => this.categories.set(categoryModal.id, categoryModal.name));

      this.lastValidCategory = categoryModals[0].id;

      this.quizForm = this.fb.group({
        name: ['', Validators.required],
        description: [''],
        categoryId: [this.lastValidCategory, Validators.required],
        categoryDisplay: [this.categories.get(this.lastValidCategory)],
        questions: this.fb.array([
          this.initQuestion()
        ])
      });

      this.filteredCategories = this.quizForm.controls['categoryDisplay'].valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter(value))
        );

      this.isLoading=false;


      ///TEST/////

      // this.quizId = "XD"

      ///////////
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return Array.from(this.categories.values()).filter(category => category.toLowerCase().includes(filterValue));
  }

  updateLastValid(event: any, category: string) {
    if (event.isUserInput) {
      // @ts-ignore
      const categoryId = Array.from(this.categories.entries()).find(([key, value]) => value === category)[0];
      this.quizForm.controls['categoryId'].setValue(categoryId);
      this.lastValidCategory = categoryId;
    }
  }

  isCategoryExists(categoryId: string){
    return this.categories.has(categoryId);
  }

  checkCategory() {
    if (!this.isOpened && !this.isCategoryExists(this.quizForm.controls['categoryId'].value)) {
      this.quizForm.controls['categoryId'].setValue(this.lastValidCategory);
      this.quizForm.controls['categoryDisplay'].setValue(this.categories.get(this.lastValidCategory));
    }
  }


  getOptionsArray(control: AbstractControl<any>): FormArray{
     return control.get('options') as FormArray;
  }



  initQuestion(): FormGroup {
    return this.fb.group({
      question: ['', Validators.required],
      options: this.fb.array([
        this.initOption(),
        this.initOption(),
        this.initOption(),
        this.initOption()
      ], Validators.required),
      answer: [0, Validators.required]
    });
  }

  onOpen() {
    this.isOpened = true;
  }


  onClose() {
    this.isOpened = false;
  }

  initOption(): FormControl {

    return new FormControl('')

  }

  addQuestion(): void {
    const questionArray = this.quizForm.get('questions') as FormArray;
    if (questionArray.length < 20) {
      questionArray.push(this.initQuestion());
    }
  }

  removeQuestion(index: number): void {
    const questionArray = this.quizForm.get('questions') as FormArray;
    questionArray.removeAt(index);
  }

  addOption(questionIndex: number): void {
    const optionArray = ((this.quizForm.get('questions') as FormArray).at(questionIndex).get('options') as FormArray);
    if (optionArray.length < 8) {
      optionArray.push(this.initOption());
    }
  }

  removeOption(questionIndex: number, optionIndex: number): void {
    const optionArray = ((this.quizForm.get('questions') as FormArray).at(questionIndex).get('options') as FormArray);
    optionArray.removeAt(optionIndex);
  }


  mapQuestionsArrayToQuestionModalArray(questionsArray: FormArray): QuestionModal[] {
    const questionModalArray: QuestionModal[] = [];

    questionsArray.controls.forEach((questionControl) => {
      const questionModal: QuestionModal = {
        question: questionControl.get('question')?.value,
        options: questionControl.get('options')?.value,
        answer: questionControl.get('answer')?.value
      };

      questionModalArray.push(questionModal);
    });

    return questionModalArray;
  }

  mapFormToQuizModal(): QuizModal {
    const quizModal: QuizModal = {
      name: this.quizForm.get('name')?.value,
      description: this.quizForm.get('description')?.value,
      questions: this.mapQuestionsArrayToQuestionModalArray(this.quizForm.get('questions') as FormArray),
      categoryId: this.quizForm.get('categoryId')?.value,
      authorId: ''
    };

    return quizModal;
  }

  submitQuiz(): void {



    if (this.quizForm.valid) {
      this.isLoading = true;
      const quizData: QuizModal =  this.mapFormToQuizModal();
      console.log(quizData)
       this.quizService.createQuiz(quizData).then(res =>{
         this.isLoading = false;
         this.quizId = res;
         }
       )
    }



  }



  get questions() {
    return this.quizForm.get('questions') as FormArray;
  }

}
