import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/auth/auth.service';
import {UsersService} from "../../shared/users.service";
import {QuizModal} from "../../shared/modal/quiz";
import {QuizService} from "../../shared/quiz.service";
import {takeUntil} from "rxjs/operators";
import {first, take} from "rxjs";
import {UserModal} from "../../shared/modal/user";
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.sass'],
})
export class UserProfileComponent implements OnInit {
  constructor(public authService: AuthService, public usersService: UsersService, private quizService: QuizService) {}

  quizzes: (QuizModal | null)[] = [];
  currentPage = 1;
  pageSize = 10;
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

              if(quizzes)
               this.quizzes = quizzes;
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
    if (confirm('Czy na pewno chcesz usunąć ten quiz?')) {
      // Logika usuwania quizu
    }
  }

  editQuiz(quiz: QuizModal): void {
    // Logika edycji quizu
  }
  getImage() {
    return this.authService.getImage();
  }
}
