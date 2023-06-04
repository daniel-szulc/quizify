import {Component, OnInit} from '@angular/core';
import {Observable, switchMap} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {CategoryService} from "../../shared/category.service";
import {map} from "rxjs/operators";
import {QuizService} from "../../shared/quiz.service";
import {QuizModal} from "../../shared/modal/quiz";
import {CategoryModal} from "../../shared/modal/category";
import {IconName as BootstrapIconName, IconName} from "ngx-bootstrap-icons/lib/types/icon-names.type";
import {findIconDefinition} from "@fortawesome/fontawesome-svg-core";
import {ClipboardService} from "../../shared/clipboard.service";

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.sass']
})
export class CategoryComponent implements OnInit {
  quizzes: (QuizModal | null)[] = [];
  public pageSize: number = 10;
  public quizzesIDs: string[] = [];
  private currentIndex: number = 0;
  public category: CategoryModal | null = null;
  public icon: BootstrapIconName | undefined;
  currentPage: number = 1;
  public categoryFound: boolean = true;
  public quizzesFound: boolean = true;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    private quizService: QuizService,
    private clipboardService: ClipboardService
  ) { }

  ngOnInit(): void {
    this.route.params.pipe(
      map(params => params['id']),
      switchMap(id => this.categoryService.getCategory(id))
    ).subscribe(category => {
      if (!category) {
        this.categoryFound = false;
        return;
      }
      this.category = category;
      this.icon = category.icon as BootstrapIconName
      if(!category.quizzes){
        this.quizzesFound = false;
        return;
      }
      this.quizzesIDs = category.quizzes;
      if (this.quizzesIDs.length === 0) {
        this.quizzesFound = false;
      } else {
        this.loadMoreQuizzes();
      }
    });
  }
  loadMoreQuizzes(): void {
    const quizSubset = this.quizzesIDs.slice(this.currentIndex, this.currentIndex + this.pageSize);
    this.quizService.getQuizzes(quizSubset).subscribe(quizzes => {
      console.log(quizzes)
      this.quizzes = [...this.quizzes, ...quizzes];
      console.log(this.quizzes)
      this.currentIndex += this.pageSize;
    });
  }

  pageChange(newPage: number): void {
    this.currentPage = newPage;
    this.loadMoreQuizzes();
  }

  goToQuiz(quizId: string): void {
    this.router.navigate(["quiz", quizId]);
  }

  getLimitedText(text: string, limit: number): string {
    if(!text)
      return "";

    if (text.length > limit) {
      return text.substring(0, limit) + '...';
    } else {
      return text;
    }
  }

  getQuizUrl(id: string){
    const baseUrl = window.location.origin;
    return `${baseUrl}/quiz?id=${id}`;
  }

  shareQuiz(id: string) {
    this.clipboardService.copyQuizUrl(id);
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
