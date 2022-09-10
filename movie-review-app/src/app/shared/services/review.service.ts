import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import { Review } from '../models/review.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  reviewCollRef: AngularFirestoreCollection<Review>;
  currentUser: any; // So we avoid importing enitre firebase namespace for one type
  constructor(
    private readonly authService: AuthService,
    private readonly afs: AngularFirestore
  ) { 
    this.reviewCollRef = this.afs.collection<Review>('reviews',ref=>ref.orderBy('created','desc'));
    this.authService.getCurrentUser()
    .subscribe(user=>this.currentUser = user)
  }

  getAllReviews(): Observable<Review[]> {
    return this.reviewCollRef.valueChanges({idField: 'id'});
  }

  createReview(reviewRef: string, reviewData: Review): void {
    this.reviewCollRef.doc<Review>(reviewRef).set(reviewData);
  }

  deleteReview(reviewRef: string): void {
    this.reviewCollRef.doc<Review>(reviewRef).delete();
  }

}
