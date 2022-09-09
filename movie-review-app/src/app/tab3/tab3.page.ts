// Builtin
import { Component } from '@angular/core';

// Services
import { AuthService } from '../core/auth/auth.service';

// Firebase
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';

// Types etc
import { Observable, take, of, map } from 'rxjs';
import { Movie } from '../shared/models/movie.model';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  moviesRef: AngularFirestoreCollection<Movie>;
  movies: Observable<Movie>[];
  watchlistRef: AngularFirestoreCollection<any>;
  currentUser: firebase.User;
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

  async addToWatchList(movieId: string, movieName: string): Promise<void> {
    // const movieData: Movie = {
    //   movieName: movieName,
    //   movieRef: movieId,
    //   ownerId: this.currentUser.uid,
    //   owner: this.currentUser.displayName,
    //   created: new Date(),
    //   rated: 4,
    //   text: "Dobar mali"
    // }
    // await this.moviesRef.add(movieData);
  }

  async updatemovie(id: string): Promise<void> {
    // const movieData: Partial<Movie> = {
    //   text: "LOS MALI >:((((",
    //   rated: 1
    // }
    // await this.moviesRef.doc(id).update(movieData);
  }

  async deletemovie(id: string): Promise<void> {
    await this.moviesRef.doc(id).delete();
  }

}
