import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { catchError, take, throwError } from 'rxjs';

import { AuthService } from '../../services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginFormGroup!: FormGroup;

  constructor(
    private readonly authService: AuthService,
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar
  ) {
    this.initializeForm();
  }

  /**
   * Returns form controls of the current group.
   */
  get formControls() {
    return this.loginFormGroup.controls;
  }

  /**
   * Defines controls, values and validators for login form group.
   */
  initializeForm() {
    this.loginFormGroup = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  /**
   * Registers and / or authenticates the user, then redirects to quiz list page.
   */
  authenticate(withRegister: boolean) {
    this.authService
      .auth(withRegister, this.loginFormGroup.getRawValue())
      .pipe(
        take(1),
        catchError((error) => {
          this.showSnackBar(error.message);
          return throwError(() => new Error(error.message));
        })
       )
      .subscribe(() => {
        this.showSnackBar(
          `User successfully ${
            withRegister ? 'registered and ' : ''
          }authenticated`
        );
        this.router.navigate(['/quiz-list']);
      });
  }

  /**
   * Triggers showing the snackbar for 3 seconds.
   */
  private showSnackBar(message: string) {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }
}
