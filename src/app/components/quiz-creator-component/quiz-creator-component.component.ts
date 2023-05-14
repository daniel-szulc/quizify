import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormArray, FormControl, AbstractControl} from '@angular/forms';


import {QuizModal} from "../../shared/modal/quiz";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {CategoryService} from "../../shared/category.service";
import {QuizService} from "../../shared/quiz.service";
import {Observable, startWith} from "rxjs";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-quiz-creator-component',
  templateUrl: './quiz-creator-component.component.html',
  styleUrls: ['./quiz-creator-component.component.sass']
})
export class QuizCreatorComponent implements OnInit {

  // @ts-ignore
  quizForm: FormGroup;
 categories: string[] = [];
  filteredCategories: Observable<string[]> = new Observable<string[]>();
  lastValidCategory: string = "";
  isOpened: boolean = false;
 //categories: Observable<string[]>;
  constructor(private fb: FormBuilder, private categoryService: CategoryService, private quizService: QuizService) { }

  ngOnInit(): void {
   this.categories = this.categoryService.getCategories();
   //  this.categoryService.getCategories().subscribe(categories => {
   //    if(categories)
   //      this.categories = categories;
   //  });


    this.lastValidCategory = this.categories[0];

     // this.categories = this.categoryService.getCategories() as Observable<string[]>;
    this.quizForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      category: [this.lastValidCategory, Validators.required],
      questions: this.fb.array([
        this.initQuestion()
      ])
    });

    this.filteredCategories = this.quizForm.controls['category'].valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    // this.quizForm.controls['category'].statusChanges.subscribe(() => {
    //   this.checkCategory()
    // })

  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.categories.filter(category => category.toLowerCase().includes(filterValue));
  }

  updateLastValid(event: any, category: string) {
    console.log("CLICK")
    console.log(event)
    if (event.isUserInput) {
      this.lastValidCategory = category;
    }
  }

  isCategoryExists(category: string){
    return this.categories.includes(category);
  }

  checkCategory() {
    if (!this.isOpened && !this.isCategoryExists(this.quizForm.controls['category'].value)) {
      this.quizForm.controls['category'].setValue(this.lastValidCategory);
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

  submitQuiz(): void {
    const quizData: QuizModal = this.quizForm.value;

    console.log(quizData)

    this.quizService.createQuiz(quizData)
  }


  get questions() {
    return this.quizForm.get('questions') as FormArray;
  }

}
