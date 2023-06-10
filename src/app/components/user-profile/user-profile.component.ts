import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/auth/auth.service';
import {UsersService} from "../../shared/users.service";
import {QuizModal} from "../../shared/modal/quiz";
import {QuizService} from "../../shared/quiz.service";
import {takeUntil} from "rxjs/operators";
import {first, take} from "rxjs";
import {UserModal} from "../../shared/modal/user";
import {CategoryService} from "../../shared/category.service";
import {ClipboardService} from "../../shared/clipboard.service";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmDialogComponent} from "./ConfirmDialogComponent";
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.sass'],
})
export class UserProfileComponent implements OnInit {
  constructor(
    public authService: AuthService,
    public usersService: UsersService,
    private categoryService: CategoryService,
    private quizService: QuizService,
    private clipboardService: ClipboardService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  quizzes: (QuizModal | null)[] = [];
  currentPage = 1;
  pageSize = 5;
  isLoading: Boolean = false;
  ngOnInit(): void {
    this.loadQuizzes();
  }

  loadQuizzes(): void {
    this.isLoading = true;
    console.log(this.authService.getUserID())
    if(!this.authService.getUserID())
      return;

    this.usersService.getUserData(this.authService.getUserID()).pipe(take(1)).subscribe(
      user => {

        if(!user) {
          this.isLoading  = false;
          return;
        }

        // @ts-ignore
        this.quizService.getQuizzes(user.quizzes).pipe(take(1))
          .subscribe(
            (quizzes: (QuizModal | null)[]) => {

              if(quizzes) {
                quizzes.forEach(quiz => {
                  if(quiz)
                    this.categoryService.getCategory(quiz.categoryId)
                      .pipe(take(1))
                      .subscribe(category => {
                        if(category) {
                          quiz.categoryName = category.name;
                        }
                      });
                });
                this.quizzes = quizzes;
              }
              this.isLoading  = false;
            }
          );
      }
    )
    // this.quizService.getQuizzes(this.authService.userData.quizzes).pipe(take(1))
    //   .subscribe(
    //   (quizzes: (QuizModal | null)[]) => {
    //     this.quizzes = quizzes;
    //   }
    // );

  }

  deleteQuiz(quiz: QuizModal): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        if(quiz.quizID) {
          this.isLoading=true;
          this.quizService.deleteQuiz(quiz.quizID).then(() => {
            this.loadQuizzes();
          });
        }

      }
    });
  }


  solveQuiz(quiz: QuizModal): void {
    this.router.navigate(['quiz', quiz.quizID])
  }
  editQuiz(quiz: QuizModal): void {
    this.router.navigate(['edit', quiz.quizID])
  }

  shareQuiz(quiz: QuizModal): void {
    if (quiz.quizID != null) {
      this.clipboardService.copyQuizUrl(quiz.quizID);
    }
  }

  getImage() {
    return this.authService.getImage();
  }
}
