import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private readonly fireAuth: AngularFireAuth
  ) { }

  async login(): Promise<firebase.auth.UserCredential> {
    return this.fireAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }
  
  async logout(): Promise<void> {
    await this.fireAuth.signOut();
  }

  getCurrentUser(): Observable<firebase.User> {
    return this.fireAuth.user;
  }
}
