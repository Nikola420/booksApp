import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Review } from '../../models/review.model';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss'],
})
export class ReviewComponent {
  @Input() reviewData: Review;
  @Input() isOwner: boolean;
  @Output() updateEvent = new EventEmitter<string>();
  @Output() deleteEvent = new EventEmitter<string>();

  constructor() { }

  viewMovie(movieId: string): void {
    console.log(movieId);
  }

}
