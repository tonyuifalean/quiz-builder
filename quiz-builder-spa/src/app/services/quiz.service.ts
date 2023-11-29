import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, switchMap, throwError } from 'rxjs';

import { environment } from '../../environments/environment';
import { QuizModel } from '../models';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  baseQuizUrl = `${environment.backendUrl}/quiz`;

  constructor(private http: HttpClient) {}

  /**
   * Returns quiz list for the current user.
   */
  getQuizList(): Observable<QuizModel[]> {
    return this.http
      .get<QuizModel[]>(`${this.baseQuizUrl}/list`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Returns the quiz corresponding to the given quiz public id.
   */
  getPublicQuiz(publicId: string): Observable<QuizModel> {
    return this.http
      .get<QuizModel>(`${this.baseQuizUrl}/public/${publicId}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Creates a quiz for the current user, containing the given data.
   */
  createQuiz(quiz: QuizModel): Observable<any> {
    return this.http
      .post(this.baseQuizUrl, quiz)
      .pipe(catchError(this.handleError));
  }

  /**
   * Validates a quiz and returns the result.
   */
  validateQuiz(publicId: string, quizRawValue: any) {
    return this.http
      .post<QuizModel>(`${ this.baseQuizUrl }/public/${ publicId }/validate`, quizRawValue)
      .pipe(catchError(this.handleError));
  }

  /**
   * Removes the quiz corresponding to the given public id.
   */
  deleteQuiz(publicId: string): Observable<QuizModel[]> {
    return this.http
      .delete(`${ this.baseQuizUrl }/${ publicId }`)
      .pipe(
        switchMap(() => this.getQuizList()),
        catchError(this.handleError)
      );
  }

  /**
   * Handles error messages coming from the API.
   */
  private handleError(error: HttpErrorResponse) {
    return throwError(() => new Error(error.error.message));
  }
}
