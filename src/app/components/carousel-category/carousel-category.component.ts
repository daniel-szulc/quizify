import {Component, Input} from '@angular/core';
import {CarouselComponent} from "../carousel/carousel.component";
import { IconNamesEnum } from 'ngx-bootstrap-icons';

@Component({
  selector: 'app-carousel-category',
  templateUrl: './carousel-category.component.html',
  styleUrls: [ '../carousel/carousel.component.sass', './carousel-category.component.sass']
})
export class CarouselCategoryComponent extends CarouselComponent{

  @Input() override itemWidth = 210;
  @Input() override itemHeight = 150;
  @Input() iconSize = '30px';
  iconNames = IconNamesEnum;

  navigate(categoryId: string){
    this.router.navigate(["category", categoryId])
  }

}
