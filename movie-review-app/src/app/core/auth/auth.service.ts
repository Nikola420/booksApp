import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private readonly fireAuth: AngularFireAuth
  ) { }

  login() {
    return this.fireAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }
  
  logout(): void {
    this.fireAuth.signOut();
  }

  getCurrentUser() {
    return this.fireAuth.user;
  }
}
