import {Component, Input} from '@angular/core';
import {NgbCarouselConfig, NgbCarouselModule, NgbSlideEvent} from "@ng-bootstrap/ng-bootstrap";
import {NgFor, NgIf, NgStyle} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";
import {image, NgxBootstrapIconsModule} from "ngx-bootstrap-icons";
import {CarouselItem} from "../../shared/utils/carousel-item.interface";
import {PromoQuizModal} from "../../shared/modal/promoQuiz";
import {Router} from "@angular/router";

@Component({
  selector: 'app-carousel-slides',
  templateUrl: './carousel-slides.component.html',
  styleUrls: ['./carousel-slides.component.sass'],
  standalone: true,
  imports: [NgbCarouselModule, NgIf, NgFor, MatButtonModule, NgxBootstrapIconsModule, NgStyle],
  providers: [NgbCarouselConfig], // add NgbCarouselConfig to the component providers
})
export class CarouselSlidesComponent {

  @Input() items: PromoQuizModal[] = [];
  images = [700, 533, 807, 124].map((n) => `https://picsum.photos/id/${n}/900/500`);

  constructor(config: NgbCarouselConfig, public router: Router) {
    this.images.push("./assets/slides/chemistry.png")
    // customize default values of carousels used by this component tree
    config.interval = 10000;
    config.keyboard = false;
    config.pauseOnHover = true;

  }
}
