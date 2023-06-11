import {Component, OnDestroy, OnInit} from '@angular/core';
import {first, Observable, Subject, switchMap} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {CategoryService} from "../../shared/category.service";
import {map, takeUntil} from "rxjs/operators";
import {QuizService} from "../../shared/quiz.service";
import {QuizModal} from "../../shared/modal/quiz";
import {CategoryModal} from "../../shared/modal/category";
import {IconName as BootstrapIconName, IconName} from "ngx-bootstrap-icons/lib/types/icon-names.type";
import {findIconDefinition} from "@fortawesome/fontawesome-svg-core";
import {ClipboardService} from "../../shared/clipboard.service";
import {UsersService} from "../../shared/users.service";

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.sass']
})
export class CategoryComponent implements OnInit, OnDestroy {
  quizzes: (QuizModal | null)[] = [];
  public pageSize: number = 10;
  public quizzesIDs: string[] = [];
  private currentIndex: number = 0;
  public category: CategoryModal | null = null;
  public icon: BootstrapIconName | undefined;
  private unsubscribe$ = new Subject<void>();
  currentPage: number = 1;
  public categoryFound: boolean = true;
  public quizzesFound: boolean = true;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    private quizService: QuizService,
    private userService: UsersService,
    private clipboardService: ClipboardService
  ) { }

  ngOnInit(): void {
    this.route.params.pipe(
      map(params => params['id']),
      switchMap(id => this.categoryService.getCategory(id))
    ).pipe(first()).subscribe(category => {
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
    this.quizService.getQuizzes(quizSubset)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(quizzes => {
        if(!quizzes)
          return;
        this.quizzes = [...this.quizzes, ...quizzes];

        if(this.quizzes)
        this.quizzes.forEach(quiz => {
          if(quiz)
          this.userService.getUsername(quiz.authorId)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(username => {
              quiz.authorName = username;
            });
        });


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

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  shareQuiz(id: string) {
    this.clipboardService.copyQuizUrl(id);
  }

}
