import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import firebase from 'firebase/compat/app';

import { Observable } from 'rxjs';
import { Movie } from '../models/movie.model';
import { Review } from '../models/review.model';

@Component({
  selector: 'app-create-review',
  templateUrl: './create-review.component.html',
  styleUrls: ['./create-review.component.scss'],
})
export class CreateReviewComponent implements OnInit {
  @Input() movieData: Observable<Movie>;
  @Input() user: firebase.User;
  @Input() showing: boolean = false;
  movieName: string;
  movieRef: string;
  reviewsRef: AngularFirestoreCollection<Review>;
  reviewForm: FormGroup;
  constructor(
    private readonly fb: FormBuilder,
    private readonly afs: AngularFirestore
  ) {
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
    await this.reviewsRef.add({
        movieName: this.movieName,
        movieRef: this.movieRef,
        created: new Date(),
        owner: this.user.displayName,
        ownerId: this.user.uid,
        ...this.reviewForm.value
      })
    this.showing = false; 
   }

   rate(stars: number): void {
    this.reviewForm.setValue({rated: stars, text: this.reviewForm.value.text});
   }

   cancel(): void {
    this.showing = false;
   }

}
