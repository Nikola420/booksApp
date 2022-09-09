// Builtin
import { Component } from '@angular/core';

// Services
import { AuthService } from '../core/auth/auth.service';

// Firebase
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';

// Types etc
import { map, Observable, take, tap } from 'rxjs';
import { Movie } from '../shared/models/movie.model';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  watchlistRef: AngularFirestoreCollection<any>;
  moviesRef: AngularFirestoreCollection<Movie>;
  movies: Observable<Movie>[] = [];
  currentUser: firebase.User;
  constructor(
    public readonly authService: AuthService,
    private readonly afs: AngularFirestore
  ) {
    this.watchlistRef = afs.collection<any>('watchlist');
    this.moviesRef = afs.collection<Movie>('movies');
    this.authService.getCurrentUser()
    .pipe(
      tap(user=>this.getWatchList(user.uid)),
      take(1)
      )
    .subscribe(user=>this.currentUser=user);
  }

  getWatchList(uid: string): void {
    this.watchlistRef.doc(uid).valueChanges()
    .subscribe(
      (movies)=>{
        this.movies = [];
        for(let movie of movies.list)
          this.movies.push(this.getMovie(movie.movieRef));
      }     
    )   
  }

  getMovie(movieRef: string): Observable<Movie> {
    return this.moviesRef.doc(movieRef).get().pipe(map(doc=>doc.data()));
  }

}
