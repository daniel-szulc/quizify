import {Component, OnInit} from '@angular/core';
import {findIconDefinition, IconName} from "@fortawesome/fontawesome-svg-core";
import {CarouselItem} from "../../shared/utils/carousel-item.interface";

import {IconName as BootstrapIconName, IconNamesEnum} from 'ngx-bootstrap-icons';
import {PromoQuizModal} from "../../shared/modal/promoQuiz";
import {take} from "rxjs";
import {CategoryModal} from "../../shared/modal/category";
import {Router} from "@angular/router";
import {FormBuilder} from "@angular/forms";
import {CategoryService} from "../../shared/category.service";
import {QuizService} from "../../shared/quiz.service";



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit{


  constructor(private categoryService: CategoryService, private quizService: QuizService) { }



  categories: CarouselItem[] = [];

  promoQuizzes: PromoQuizModal[] = [];
  iconNames = IconNamesEnum;

  ngOnInit() {
    this.categoryService.getCategories().pipe(take(1)).subscribe((categoryModals: CategoryModal[]) => {
      for (const category of categoryModals) {

        const prefix = 'fal';

        const iconName = category.icon as IconName;

        let iconDefinition = findIconDefinition({prefix, iconName});
        // @ts-ignore
        console.log(category.icon as BootstrapIconName)

        this.categories.push(
          {
            name: category.name,
            icon: iconDefinition,
            bootstrapIconName: category.icon as BootstrapIconName,
            count: category.quizzes ? category.quizzes.length : 0,
            id: category.id
          }
        )

        if (category.promoQuiz) {
          const promoQuiz = {
            ...category.promoQuiz,
            category: category.name,
            categoryIcon: category.icon as BootstrapIconName
          } as PromoQuizModal

          this.promoQuizzes.push(promoQuiz)
        }
      }
    });
  }
}
