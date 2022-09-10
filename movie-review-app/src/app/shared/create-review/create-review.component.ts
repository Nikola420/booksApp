import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Observable } from 'rxjs';
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
  @Input() showing: boolean = false;
  @Output() submit$ = new EventEmitter<Review>();
  user: any; // firebase.User | null | undefined
  movieName: string;
  movieRef: string;
  reviewsRef: AngularFirestoreCollection<Review>;
  reviewForm: FormGroup;
  constructor(
    private readonly fb: FormBuilder,
    private readonly afs: AngularFirestore,
    private readonly authService: AuthService
  ) {
    this.authService.getCurrentUser()
    .subscribe(user=>this.user = user);
    this.reviewsRef = afs.collection('reviews');
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
   }

   ngOnInit(): void {
    this.movieData.subscribe(movie=>{
      this.movieName = movie.name;
      this.movieRef = movie.id;
    })
   }

   async submit(): Promise<void> {
    this.submit$.emit({
        movieName: this.movieName,
        movieRef: this.movieRef,
        created: new Date(),
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
   }

}
