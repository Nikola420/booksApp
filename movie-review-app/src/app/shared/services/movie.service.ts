import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { map, Observable, take } from 'rxjs';
import { Movie } from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  movieCollRef: AngularFirestoreCollection<Movie>;
  constructor(
    private readonly afs: AngularFirestore
  ) {
    this.movieCollRef = this.afs.collection<Movie>('movies');
   }

   getMovie(movieRef: string): Observable<Movie> {
    return this.movieCollRef.doc<Movie>(movieRef)
    .get()
    .pipe(
      map(doc=>{
        let movie = doc.data();
        movie.id = movieRef;
        return movie;
      }),
      take(1)
    )
   }

   getMovies(movieRefs: string[]): Observable<Movie>[] {
    let out: Observable<Movie>[] = [];
    for(let movieRef of movieRefs)
      out.push(this.getMovie(movieRef))
    return out;
   }

   getAllMovies(): Observable<Movie[]> {
    return this.movieCollRef.valueChanges({idField: 'id'});
   }
  
}
