// Builtin
import { Component, OnInit } from '@angular/core';

// Services
import { UserService } from '../shared/services/user.service';
import { MovieService } from '../shared/services/movie.service';

// Types etc
import { map, Observable } from 'rxjs';
import { Movie } from '../shared/models/movie.model';
import { Review } from '../shared/models/review.model';
import { ReviewService } from '../shared/services/review.service';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  movies: Observable<Movie>[] = [];
  currentUser: any;
  visibleReviewIndex: number = -1;
  constructor(
    private readonly userService: UserService,
    private readonly movieService: MovieService,
    private readonly reviewService: ReviewService
  ) {}

  ngOnInit(): void {
    this.userService.getUserData()
    .pipe(
      map(user=>{
        this.movies = [];
        for(let movie of user.watchlist)
          this.movies.push(this.movieService.getMovie(movie.movieRef))
      })
    )
    .subscribe()
  }

  createReview(review: Review): void {
    this.visibleReviewIndex = -1;
    const {id, ...rest} = review;
    this.reviewService.createReview(id, rest);
    this.userService.addReview(id);
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
