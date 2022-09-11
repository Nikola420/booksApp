// Builtin
import { Component } from '@angular/core';

// Services
import { ReviewService } from '../shared/services/review.service';
import { UserService } from '../shared/services/user.service';
import { AuthService } from '../core/auth/auth.service';

// Types etc
import { Observable, tap } from 'rxjs';
import { Review } from '../shared/models/review.model';
import { MovieService } from '../shared/services/movie.service';
import { Movie } from '../shared/models/movie.model';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  reviews: Observable<Review[]>;
  movies: Observable<Movie>[] = [];
  currentUser: any; // So we avoid importing enitre firebase namespace for one type
  visibleReviewFormIndex: number = -1;
  constructor(
    private readonly userService: UserService,
    private readonly reviewService: ReviewService,
    private readonly movieService: MovieService,
    private readonly authService: AuthService
  ){
    this.authService.getCurrentUser().subscribe(user=>this.currentUser=user);
    this.reviews = this.reviewService.getAllReviews()
    .pipe(
      tap(reviews=>this.movies=this.movieService.getMovies(reviews.map(r=>r.movieRef)))
    )
  }

  getMovie(movieRef: string): Observable<Movie> {
    return this.movieService.getMovie(movieRef);
  }

  updateReview(review: Review): void {
    this.visibleReviewFormIndex = -1;
    const {id, ...reviewData} = review;
    this.reviewService.updateReview(id, reviewData);
  }

  deleteReview(reviewRef: string): void {
    this.userService.removeReview(reviewRef);
    this.reviewService.deleteReview(reviewRef);
  }

}
// export class Tab2Page {
//   reviewsRef: AngularFirestoreCollection<Review>;
//   reviews: Observable<any[]>;
//   currentUser: firebase.User;
//   constructor(
//     public readonly authService: AuthService,
//     private readonly afs: AngularFirestore
//   ) {
//     this.reviewsRef = afs.collection<Review>('reviews', ref=>ref.orderBy('created', 'desc'));
//     this.reviews = this.reviewsRef.valueChanges({idField: 'id'});
//     this.authService.getCurrentUser()
//     .pipe(take(1))
//     .subscribe(user=>this.currentUser=user);
//   }

//   async createReview(movieId: string, movieName: string): Promise<void> {
//     const reviewData: Review = {
//       movieName: movieName,
//       movieRef: movieId,
//       ownerId: this.currentUser.uid,
//       owner: this.currentUser.displayName,
//       created: new Date(),
//       rated: 4,
//       text: "Dobar mali"
//     }
//     await this.reviewsRef.add(reviewData);
//   }

//   async updateReview(id: string): Promise<void> {
//     const reviewData: Partial<Review> = {
//       text: "LOS MALI >:((((",
//       rated: 1
//     }
//     await this.reviewsRef.doc(id).update(reviewData);
//   }

//   async deleteReview(id: string): Promise<void> {
//     await this.reviewsRef.doc(id).delete();
//   }

// }
