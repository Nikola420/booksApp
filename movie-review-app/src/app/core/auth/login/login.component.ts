import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(
    public readonly authService: AuthService,
  ) { }

  login(): void {
    this.authService.login();
  }
  
  logout(): void {
    this.authService.logout();
  }

}
