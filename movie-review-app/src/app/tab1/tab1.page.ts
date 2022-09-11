// Builtin
import { Component, OnInit } from '@angular/core';

// Services
import { UserService } from '../shared/services/user.service';
import { MovieService } from '../shared/services/movie.service';

// Types etc
import { map, Observable, switchMap, take, tap } from 'rxjs';
import { User } from '../shared/models/user.model';
import { Movie } from '../shared/models/movie.model';
import { Review } from '../shared/models/review.model';
import { ReviewService } from '../shared/services/review.service';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  userData: Observable<User>;
  watchList: Observable<Movie>[];
  reviews: Observable<Review>[];
  currentUser: any; // firebase.User | null | undefined
  visibleReviewIndex: number = -1;
  constructor(
    private readonly userService: UserService,
    public readonly movieService: MovieService,
    public readonly reviewService: ReviewService
  ) {
    this.userData = this.userService.getUserData()
    .pipe(
      tap(user=>{
        this.watchList = this.movieService.getMovies(user.watchlist.map(m=>m.movieRef));
        this.reviews = this.reviewService.getUserReviews(user.reviews);
      } 
      )
    )
  }

  async createReview(review: Review): Promise<void> {
    this.visibleReviewIndex = -1;
    const id = (await this.reviewService.createReview(review)).id;
    this.userService.addReview(id);
  }

  didWatch(watchList: User['watchlist'], index: number): boolean {
    return watchList[index].watched;
  }

  markWatched(movieRef:string, watched: boolean): void {
    this.userService.markWatched(movieRef, watched);
  }

  removeFromWatchList(movieRef: string): void {
    this.userService.removeFromWatchList(movieRef);
  }

}
// export class Tab1Page {
  // watchlistRef: AngularFirestoreDocument;
  // moviesRef: AngularFirestoreCollection<Movie>;
  // movies: Observable<Movie>[] = [];
  // currentUser: firebase.User;
  // visibleReviewIndex: number = -1;
  // constructor(
  //   public readonly authService: AuthService,
  //   private readonly afs: AngularFirestore
  // ) {
    // this.moviesRef = afs.collection<Movie>('movies');
    // this.authService.getCurrentUser()
    // .pipe(
    //   tap(user=>this.getWatchList(user.uid)),
    //   take(1)
    //   )
    // .subscribe(user=>this.currentUser=user);
  // }

  // getWatchList(uid: string): void {
  //   this.watchlistRef = this.afs.collection<any>('watchlist').doc<{list:{movieRef:string}[]}>(uid);
  //   this.watchlistRef.valueChanges()
  //   .subscribe(
  //     (movies)=>{
  //       this.movies = [];
  //       for(let movie of movies.list)
  //         this.movies.push(this.getMovie(movie.movieRef));
  //     }     
  //   )   
  // }

  // removeFromWatchList(movieId: string): void {
  //   this.watchlistRef.get()
  //   .pipe(
  //     map(doc=>doc.data()),
  //     switchMap(doc=>this.watchlistRef.update({list: [...doc.list.filter(m=>m.movieRef!==movieId)]}))
  //     )
  //   .subscribe()
  // }



// }
