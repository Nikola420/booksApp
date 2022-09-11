// Builtin
import { Component } from '@angular/core';

// Reviews
import { MovieService } from '../shared/services/movie.service';
import { ReviewService } from '../shared/services/review.service';
import { UserService } from '../shared/services/user.service';

// Types etc
import { Observable, of } from 'rxjs';
import { Movie } from '../shared/models/movie.model';
import { Review } from '../shared/models/review.model';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  movies: Observable<Movie>[];
  visibleReviewFormIndex: number = -1;
  constructor(
    private readonly movieService: MovieService,
    private readonly userService: UserService,
    private readonly reviewService: ReviewService
  ){
    movieService.getAllMovies()
    .subscribe(
      (movies)=>{
        this.movies = [];
        for(let movie of movies)
          this.movies.push(of(movie));
      }
    )
  }

  addToWatchList(movieRef: string): void {
    this.userService.addToWatchList(movieRef);
  }

  async createReview(reviewData: Review): Promise<void> {
    this.visibleReviewFormIndex = -1;
    const newReviewId = (await this.reviewService.createReview(reviewData)).id;
    this.userService.addReview(newReviewId);
  }

}
// export class Tab3Page {
//   moviesRef: AngularFirestoreCollection<Movie>;
//   movies: Observable<Movie>[];
//   currentUser: firebase.User;
//   visibleReviewIndex: number = -1;
//   constructor(
//     public readonly authService: AuthService,
//     private readonly afs: AngularFirestore,
//   ) {
//     this.moviesRef = afs.collection<Movie>('movies');
//     this.moviesRef.valueChanges({idField: 'id'})
//     .pipe(
//       map(doc=>doc.map(movie=>{
//         const {id, ...rest} = movie;
//         let temp = {id: id, ...rest};
//         return temp;
//       }))
//     )
//     .subscribe(
//       (movies)=>{
//         this.movies = [];
//         for(let movie of movies)
//           this.movies.push(of(movie));
//       }
//     );
//     this.authService.getCurrentUser()
//     .pipe(take(1))
//     .subscribe(user=>this.currentUser=user);
//   }

//   addToWatchList(movieId: string): void {
//     const watchlistRef = this.afs.collection<any>('watchlist').doc<{list:{movieRef:string}[]}>(this.currentUser.uid);
//     watchlistRef.get()
//     .pipe(
//       map(doc=>doc.data()),
//       switchMap(doc=>watchlistRef.set({list: [...doc.list.filter(m=>m.movieRef!==movieId), {movieRef: movieId}]}))
//     ) 
//     .subscribe({
//       error: async () => await watchlistRef.set({list: [{movieRef: movieId}]})
//       })
//   }

// }
