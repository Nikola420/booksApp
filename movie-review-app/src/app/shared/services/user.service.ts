import { Injectable } from '@angular/core';

// Firestore
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { map, Observable, of, Subject, switchMap, take, tap } from 'rxjs';

// Services
import { AuthService } from '../../core/auth/auth.service';

// Types etc
import { User } from '../models/user.model';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  userDocRef: AngularFirestoreDocument<User>;
  loaded: Subject<boolean> = new Subject<boolean>();
  constructor(
    private readonly authService: AuthService,
    private readonly afs: AngularFirestore
  ) {
    this.authService.getCurrentUser()
    .pipe(
      switchMap(user=>
        {
          this.userDocRef = afs.collection<User>('users').doc<User>(user.uid);
          return this.userDocRef.get();
        }  
      ),
      switchMap(async doc=>{
        if(doc.data()!==undefined)
          return of(doc);
        await this.userDocRef.set({watchlist:[], reviews:[]});
        return this.userDocRef.get()
      }
      ),
      take(1)
    )
    .subscribe(()=>this.loaded.next(true))
   }

  getUserData(): Observable<User> {
    return this.loaded.pipe(
      switchMap(()=>{
        return this.userDocRef.valueChanges()
      })
    )
  }

  addToWatchList(newMovieRef: string): void {
    this.userDocRef.get()
    .pipe(
      map(doc=>doc.data().watchlist),
      switchMap(
        watchlist=>this.userDocRef.update({
          watchlist: [
            ...watchlist.filter(m=>m.movieRef!==newMovieRef), 
            {movieRef: newMovieRef, watched: false}
          ]
        })),
        take(1)
    )
    .subscribe()
  }

  markWatched(movieRef: string, watched: boolean): void {
    this.userDocRef.get()
    .pipe(
      map(doc=>doc.data().watchlist),
      switchMap(
        watchlist=>this.userDocRef.update({
          watchlist: [
            ...watchlist.filter(m=>m.movieRef!==movieRef), 
            {movieRef: movieRef, watched: watched}
          ]
        })),
        take(1)
    )
    .subscribe()
  }

  removeFromWatchList(movieRef: string): void {
    this.userDocRef.get()
    .pipe(
      map(doc=>doc.data().watchlist),
      switchMap(watchlist=>this.userDocRef.update({watchlist: watchlist.filter(m=>m.movieRef!==movieRef)})),
      take(1)
    )
    .subscribe()
  }

  addReview(newReviewRef: string): void {
    this.userDocRef.get()
    .pipe(
      map(doc=>doc.data().reviews),
      switchMap(
        reviews=>this.userDocRef.update({reviews: [...reviews, newReviewRef]})
      )
    )
  }

  removeReview(reviewRef: string): void {
    this.userDocRef.get()
    .pipe(
      map(doc=>doc.data().reviews),
      switchMap(
        reviews=>this.userDocRef.update({reviews: reviews.filter(rf=>rf!==reviewRef)})
      ),
      take(1)
    )
    .subscribe()
  }

}
