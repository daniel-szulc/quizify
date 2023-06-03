import { Component, Input, OnInit } from '@angular/core';
import {CarouselItem} from "../../shared/utils/carousel-item.interface";
import {Router} from "@angular/router";


@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.sass']
})
export class CarouselComponent implements OnInit {
  @Input() items: CarouselItem[] = [];
  @Input() itemWidth = 180;
  @Input() itemHeight = 120;

  private scrollAmount = 0;

  constructor(public router: Router) {}

  ngOnInit(): void {
    this.scrollAmount = this.itemWidth + 20; // +20 for the margin
  }

  move(direction: 'previous' | 'next'): void {
    const carouselItems = document.querySelector('.carousel-items');
    if (direction === 'previous') {
      carouselItems?.scrollBy({ left: -this.scrollAmount, behavior: 'smooth' });
    } else {
      carouselItems?.scrollBy({ left: this.scrollAmount, behavior: 'smooth' });
    }
  }
}
