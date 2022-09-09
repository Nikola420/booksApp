import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable, switchMap, of } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedInGuard implements CanLoad {
  constructor(
    private readonly router: Router,
    private readonly authService: AuthService
  ){}
  canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.authService.getCurrentUser()
    .pipe(
      switchMap(user=>{
        if(user !== null)
          return of(true);
        return this.router.navigate(['login']);
      }
      )
    );
  }
}
