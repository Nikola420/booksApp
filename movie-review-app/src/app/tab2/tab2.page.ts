// Builtin
import { Component } from '@angular/core';

// Services
import { AuthService } from '../core/auth/auth.service';

// Firebase
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';

// Types etc
import { Observable, take } from 'rxjs';
import { Review } from '../models/review.model';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  reviewsRef: AngularFirestoreCollection<Review>;
  reviews: Observable<any[]>;
  currentUser: firebase.User;
  constructor(
    public readonly authService: AuthService,
    private readonly afs: AngularFirestore
  ) {
    this.reviewsRef = afs.collection<Review>('reviews', ref=>ref.orderBy('created', 'desc').limit(20));
    this.reviews = this.reviewsRef.valueChanges({idField: 'id'});
    this.authService.getCurrentUser()
    .pipe(take(1))
    .subscribe(user=>this.currentUser=user);
  }

  async createReview(movieId: string): Promise<void> {
    const reviewData: Review = {
      movie: movieId,
      ownerId: this.currentUser.uid,
      owner: this.currentUser.displayName,
      created: new Date(),
      rated: 4,
      text: "Dobar mali"
    }
    await this.reviewsRef.add(reviewData);
  }

  async updateReview(id: string): Promise<void> {
    const reviewData: Partial<Review> = {
      text: "LOS MALI >:((((",
      rated: 1
    }
    await this.reviewsRef.doc(id).update(reviewData);
  }

  async deleteReview(id: string): Promise<void> {
    await this.reviewsRef.doc(id).delete();
  }

}
