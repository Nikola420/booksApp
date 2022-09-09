// Builtin
import { Component } from '@angular/core';

// Services
import { AuthService } from '../core/auth/auth.service';

// Firebase
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';

// Types etc
import { map, Observable, switchMap, take, tap } from 'rxjs';
import { Movie } from '../shared/models/movie.model';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  watchlistRef: AngularFirestoreDocument;
  moviesRef: AngularFirestoreCollection<Movie>;
  movies: Observable<Movie>[] = [];
  currentUser: firebase.User;
  visibleReviewIndex: number = -1;
  constructor(
    public readonly authService: AuthService,
    private readonly afs: AngularFirestore
  ) {
    this.moviesRef = afs.collection<Movie>('movies');
    this.authService.getCurrentUser()
    .pipe(
      tap(user=>this.getWatchList(user.uid)),
      take(1)
      )
    .subscribe(user=>this.currentUser=user);
  }

  getWatchList(uid: string): void {
    this.watchlistRef = this.afs.collection<any>('watchlist').doc<{list:{movieRef:string}[]}>(uid);
    this.watchlistRef.valueChanges()
    .subscribe(
      (movies)=>{
        this.movies = [];
        for(let movie of movies.list)
          this.movies.push(this.getMovie(movie.movieRef));
      }     
    )   
  }

  removeFromWatchList(movieId: string): void {
    this.watchlistRef.get()
    .pipe(
      map(doc=>doc.data()),
      switchMap(doc=>this.watchlistRef.update({list: [...doc.list.filter(m=>m.movieRef!==movieId)]}))
      )
    .subscribe()
  }

  getMovie(movieRef: string): Observable<Movie> {
    return this.moviesRef.doc(movieRef).get().pipe(map(doc=>{return {id: movieRef, ...doc.data()}}));
  }

}
