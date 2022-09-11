import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Movie } from '../models/movie.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.scss'],
})
export class MovieComponent {
  @Input() watched: boolean;
  @Input() movieData: Observable<Movie>;
  @Input() mode: 'watchList' | 'browse';
  @Output() markWatched$ = new EventEmitter<{movieRef:string, watched: boolean}>();
  @Output() review$ = new EventEmitter<null>();
  @Output() addToWatchList$ = new EventEmitter<Movie>;
  @Output() removeFromWatchList$ = new EventEmitter<Movie>;
  constructor() { }

  markWatched(movieRef: string): void {
    this.markWatched$.emit({movieRef: movieRef, watched: !this.watched});
  }

}
