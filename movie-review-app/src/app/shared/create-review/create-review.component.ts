import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Observable, take } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import { Movie } from '../models/movie.model';
import { Review } from '../models/review.model';

@Component({
  selector: 'app-create-review',
  templateUrl: './create-review.component.html',
  styleUrls: ['./create-review.component.scss'],
})
export class CreateReviewComponent implements OnInit {
  @Input() movieData: Observable<Movie>;
  @Input() existingReviewData: Review | undefined;
  @Input() showing: boolean = false;
  @Output() submit$ = new EventEmitter<Review>();
  @Output() cancel$ = new EventEmitter<null>();
  user: any; // firebase.User | null | undefined
  movieName: string;
  movieRef: string;
  reviewForm: FormGroup;
  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService
  ) {
    this.authService.getCurrentUser()
    .subscribe(user=>this.user = user);
    this.reviewForm = fb.group({
      rated: [5, [
        Validators.required,
        Validators.max(5),
        Validators.min(1)
      ]],
      text: ['', [
        Validators.required,
        Validators.maxLength(10000)
      ]]
    });
    if(this.existingReviewData)
      this.reviewForm.setValue({rated: this.existingReviewData.rated, text: this.existingReviewData.text});
   }

   ngOnInit(): void {
    this.movieData
    .pipe(
      take(1)
    )
    .subscribe(movie=>{
      this.movieName = movie.name;
      this.movieRef = movie.id;
    })
   }

  submit(): void {
    if(!this.existingReviewData)
    this.submit$.emit({
      movieName: this.movieName,
      movieRef: this.movieRef,
      created: new Date(),
      owner: this.user.displayName,
      ownerId: this.user.uid,
      ...this.reviewForm.value
    })
    else 
    this.submit$.emit({
      id: this.existingReviewData.id,
      movieName: this.movieName,
      movieRef: this.movieRef,
      created: this.existingReviewData.created,
      owner: this.user.displayName,
      ownerId: this.user.uid,
      ...this.reviewForm.value
    })
   }

   rate(stars: number): void {
    this.reviewForm.setValue({rated: stars, text: this.reviewForm.value.text});
   }

   cancel(): void {
    this.showing = false;
    this.cancel$.emit(null);
   }

}
