import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth/auth.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  logout(): void {
    this.authService.logout().then(()=>this.router.navigate(['login']));
  }

}
