import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatRadioChange } from '@angular/material/radio';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import get from 'lodash.get';
import {
  catchError,
  Subject,
  switchMap,
  take,
  takeUntil,
  tap,
  throwError,
} from 'rxjs';

import { QuizModel } from '../../models';
import { AuthService, QuizService } from '../../services';

@Component({
  selector: 'app-public-quiz',
  templateUrl: './public-quiz.component.html',
  styleUrls: ['./public-quiz.component.scss'],
})
export class PublicQuizComponent implements OnInit, OnDestroy {
  quizFormGroup!: FormGroup;
  quizResult!: string;
  publicQuizData!: QuizModel;
  showLoader = false;

  /**
   * Returns question form control list.
   */
  get questions(): FormArray {
    return get(this.quizFormGroup.controls, 'questions') as FormArray;
  }

  private readonly onDestroy$ = new Subject<boolean>();

  constructor(
    readonly authService: AuthService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly quizService: QuizService,
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.activatedRoute.params
      .pipe(
        tap(() => (this.showLoader = true)),
        switchMap((params) => {
          return this.quizService.getPublicQuiz(params['publicId']).pipe(
            takeUntil(this.onDestroy$),
            catchError((error) => {
              this.snackBar.open(error.message, 'Close', {
                duration: 3000,
              });
              this.showLoader = false;
              return throwError(() => new Error(error.message));
            })
          );
        })
      )
      .subscribe((quizData: QuizModel) => {
        this.publicQuizData = quizData;
        this.addControlsToForm();
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

  getQuestionContext(id: number) {
    return this.publicQuizData.questions[id];
  }

  /**
   * Updates question control value corresponding to the given id on radio group change.
   */
  radioGroupChange(event: MatRadioChange, i: number) {
    this.questions.controls[i].setValue({
      id: this.questions.controls[i].value.id,
      value: [event.value],
    });
  }

  /**
   * Updates question control value corresponding to the given id on checkbox change.
   */
  checkboxChange(event: MatCheckboxChange, i: number) {
    const checked = event.checked;
    const value = event.source.value;
    let previousValue = this.questions.controls[i].getRawValue();
    const index = previousValue.value.indexOf(value);
    if (index > -1 && !checked) {
      previousValue.value.splice(index, 1);
    } else {
      if (index === -1) {
        previousValue.value.push(value);
      }
    }
    this.questions.controls[i].setValue({
      id: this.questions.controls[i].value.id,
      value: previousValue.value,
    });
  }

  /**
   * Validates quiz in the backend and displays result.
   */
  validateQuiz() {
    const questionRawValue = this.questions.getRawValue();
    this.quizService.validateQuiz(this.publicQuizData.publicId, questionRawValue)
      .pipe(take(1)).subscribe((scoreValue) => {
      this.quizResult = `${scoreValue}/${this.questions.controls.length}`;
    })
  }

  /**
   * Redirects back to quiz list page.
   */
  backToQuizList() {
    this.router.navigate(['quiz-list']);
  }

  /**
   * Defines controls and values for quiz form group.
   */
  private initializeForm() {
    this.quizFormGroup = this.fb.group({
      questions: this.fb.array([]),
    });
  }

  /**
   * Defines controls for each question in the list.
   */
  private addControlsToForm() {
    const questionList = this.publicQuizData?.questions;
    if (this.publicQuizData && questionList.length) {
      questionList.forEach((_, i) => {
        const newQuestion: FormControl = this.fb.control({
          id: i,
          value: [],
        });
        this.questions.insert(this.questions.length, newQuestion);
      });
    }
  }
}
