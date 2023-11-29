import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    readonly authService: AuthService,
    private readonly router: Router,
  ) { }

  logoutUser() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
