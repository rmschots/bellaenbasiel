import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'bnb-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StarRatingComponent {

  @Input() maxStars = 5;
  @Input() stars: number;

  get amountOfFullStars(): number {
    return Math.floor(Math.round(this.stars * 2) / 2);
  }

  get hasHalfStar(): boolean {
    return (Math.round(this.stars * 2) / 2 % 1) > 0;
  }

  get amountOfEmptyStars(): number {
    return Math.floor(this.maxStars - (Math.round(this.stars * 2) / 2));
  }

  starList(length: number) {
    return new Array(length);
  }

}
