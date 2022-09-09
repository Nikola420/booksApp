import { Component, Input } from '@angular/core';
import { Movie } from '../models/movie.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.scss'],
})
export class MovieComponent {
  @Input() movieData: Observable<Movie>;
  @Input() mode: 'watchList' | 'browse';
  constructor() { }

}
