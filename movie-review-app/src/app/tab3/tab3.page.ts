// Builtin
import { Component } from '@angular/core';

// Services
import { AuthService } from '../core/auth/auth.service';

// Firebase
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';

// Types etc
import { Observable, take, of, map, switchMap } from 'rxjs';
import { Movie } from '../shared/models/movie.model';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  moviesRef: AngularFirestoreCollection<Movie>;
  movies: Observable<Movie>[];
  currentUser: firebase.User;
  visibleReviewIndex: number = -1;
  constructor(
    public readonly authService: AuthService,
    private readonly afs: AngularFirestore,
  ) {
    this.moviesRef = afs.collection<Movie>('movies');
    this.moviesRef.valueChanges({idField: 'id'})
    .pipe(
      map(doc=>doc.map(movie=>{
        const {id, ...rest} = movie;
        let temp = {id: id, ...rest};
        return temp;
      }))
    )
    .subscribe(
      (movies)=>{
        this.movies = [];
        for(let movie of movies)
          this.movies.push(of(movie));
      }
    );
    this.authService.getCurrentUser()
    .pipe(take(1))
    .subscribe(user=>this.currentUser=user);
  }

  addToWatchList(movieId: string): void {
    const watchlistRef = this.afs.collection<any>('watchlist').doc<{list:{movieRef:string}[]}>(this.currentUser.uid);
    watchlistRef.get()
    .pipe(
      map(doc=>doc.data()),
      switchMap(doc=>watchlistRef.update({list: [...doc.list.filter(m=>m.movieRef!==movieId), {movieRef: movieId}]}))
      )
    .subscribe()
  }

}
