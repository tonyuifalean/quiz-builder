import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  Observable,
  switchMap,
  tap,
  throwError,
} from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthResponseModel, LoginModel } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseAuthUrl = `${environment.backendUrl}/user`;

  public currentUser: Observable<string>;
  public get currentUserValue(): string {
    return this.currentUserSubject.value;
  }
  private currentUserSubject: BehaviorSubject<string>;

  constructor(private http: HttpClient) {
    // Reads the jwt token, stores and emits the initial value.
    this.currentUserSubject = new BehaviorSubject<string>(
      localStorage.getItem('jwt_token') || ''
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  /**
   * Registers and / or authenticates the user, then stores and emit the new jwt token.
   */
  auth(
    withRegister: boolean,
    body: LoginModel
  ): Observable<AuthResponseModel | HttpErrorResponse> {
    if (withRegister) {
      return this.http
        .post(`${this.baseAuthUrl}/register`, body)
        .pipe(switchMap(() => this.auth(false, body)));
    } else {
      return this.http
        .post<AuthResponseModel>(`${this.baseAuthUrl}/login`, body)
        .pipe(
          tap(({ token }) => {
            localStorage.setItem('jwt_token', token);
            this.currentUserSubject.next(token);
          }),
          catchError((error: HttpErrorResponse) => {
            return throwError(() => new Error(error.error.message));
          })
        );
    }
  }

  /**
   * Returns the stored jwt token.
   */
  public getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  /**
   * Logs out the user by removing the stored jwt token and emitting empty value.
   */
  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('jwt_token');
    this.currentUserSubject.next('');
  }
}
