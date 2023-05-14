import {Component, OnInit} from '@angular/core';
import {findIconDefinition, IconName} from "@fortawesome/fontawesome-svg-core";
import {CarouselItem} from "../../shared/utils/carousel-item.interface";

import {IconName as BootstrapIconName, IconNamesEnum} from 'ngx-bootstrap-icons';
import {PromoQuizModal} from "../../shared/modal/promoQuiz";



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit{
  categories:CarouselItem[] = [];

  promoQuizzes: PromoQuizModal[] = [];
  iconNames = IconNamesEnum;

  _categories = [
    {
      name: "General",
      icon: "globe2"
    },
    {
      name: "Music",
      icon: 'headphones'
    },
    {
      name: "Book",
      icon: 'book'
    },
    {
      name: "History",
      icon: 'hourglass-bottom',
      promoQuiz: {
        title: "Through the Ages",
        subtitle: "Fancy yourself a historian? Assess your knowledge of world history!",
        buttonText: "Step into the past!",
        quizId: "TEST-geography",
        background: "linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)"
      }
    },
    {
      name: "Math",
      icon: 'calculator'
    },
    {
      name: "Science",
      icon: "flask"
    },
    {
      name: "Art",
      icon: "palette"
    },
    {
      name: "Technology",
      icon: "laptop"
    },
    {
      "name": "Geography",
      "icon": "globe-americas",
      promoQuiz: {
        title: "Globe Trotter",
        subtitle: "How well do you know our world? Put your geography skills to the test!",
        buttonText: "Start your journey!",
        quizId: "TEST-geography",
        background: "linear-gradient(62deg, #FBAB7E 0%, #F7CE68 100%)"

}
    },
    {
      "name": "Sport",
      "icon": "futbol"
    },
    {
      "name": "Game",
      "icon": "joystick"
    },
    {
      "name": "Movie and TV",
      "icon": "film",
      promoQuiz: {
        title: "The Marvel Universe",
        subtitle: "Are you a real fan of superheroes? Test your knowledge of the Marvel Cinematic Universe!",
        buttonText: "Accept the challenge!",
        quizId: "TEST-marvelQuiz",
        background: "radial-gradient( circle farthest-corner at 10% 20%,  rgba(255,0,49,1) 0%, rgba(255,41,142,1) 92% )"
      }
    },
    {
      "name": "Animal",
      "icon": "paw"
    },
    {
      "name": "Motorsports",
      "icon": "car"
    },
    {
      "name": "Celebrities",
      "icon": "star"
    },
    {
      "name": "Anatomy",
      "icon": "brain"
    },
  ]

  ngOnInit() {

      for (const category of this._categories) {

        const prefix = 'fal'; // Zmień prefiks na 'far' lub 'fab' dla innych zestawów ikon

        const iconName = category.icon as IconName;

        let iconDefinition = findIconDefinition({ prefix, iconName});
        // @ts-ignore
        console.log(category.icon as BootstrapIconName)

          this.categories.push(
            {
              name: category.name,
              icon: iconDefinition,
              bootstrapIconName: category.icon as BootstrapIconName
            }
          )

        if(category.promoQuiz) {
          const promoQuiz = {
            ...category.promoQuiz,
            category: category.name,
            categoryIcon: category.icon as BootstrapIconName
          }  as PromoQuizModal

           this.promoQuizzes.push(promoQuiz)
        }
    }

  }
}
