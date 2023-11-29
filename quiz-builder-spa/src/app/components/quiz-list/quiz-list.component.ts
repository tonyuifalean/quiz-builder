import { Clipboard } from '@angular/cdk/clipboard';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subject, take, takeUntil } from 'rxjs';

import { QuizModel } from '../../models';
import { QuizService } from '../../services';

@Component({
  selector: 'app-quiz-list',
  templateUrl: './quiz-list.component.html',
  styleUrls: ['./quiz-list.component.scss'],
})
export class QuizListComponent implements OnInit, OnDestroy {
  quizList: QuizModel[] = [];

  showLoader = true;

  private readonly onDestroy$ = new Subject<boolean>();

  constructor(
    private readonly clipboard: Clipboard,
    private readonly quizService: QuizService,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.quizService
      .getQuizList()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((quizzes) => {
        this.quizList = quizzes;
        setTimeout(() => {
          this.showLoader = false;
        }, 1000);
      });
  }

  /**
   * Removes the subscription list.
   */
  ngOnDestroy() {
    this.onDestroy$.next(true);
  }

  /**
   * Removes a quiz corresponding to the given public id.
   */
  deleteQuiz(publicId: string) {
    this.showLoader = true;
    this.quizService
      .deleteQuiz(publicId)
      .pipe(take(1))
      .subscribe((quizList: QuizModel[]) => {
        this.quizList = quizList;
        this.showSnackBar('Quiz successfully deleted');
        setTimeout(() => {
          this.showLoader = false;
        }, 1000);
      });
  }

  /**
   * Redirects to quiz page.
   */
  addNewQuiz() {
    this.router.navigate(['quiz']);
  }

  /**
   * Redirectets to public quiz page.
   */
  navigateToQuiz(publicId: string) {
    this.router.navigate([`quiz/${publicId}`]);
  }

  /**
   * Adds public id to clipboard.
   */
  copyToClipboard(publicId: string) {
    this.clipboard.copy(`${window.location.origin}/quiz/${publicId}`);
    this.showSnackBar('Quiz public id successfully copied to clipboard');
  }

  /**
   * Triggers showing the snackbar for 3 seconds.
   */
  private showSnackBar(message: string) {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }
}
