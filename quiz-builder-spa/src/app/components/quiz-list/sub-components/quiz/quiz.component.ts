import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import get from 'lodash.get';
import { take } from 'rxjs';
import { noWhitespaceValidator } from 'src/app/utils';

import { QuizModel } from '../../../../models';
import { QuizService } from '../../../../services';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
})
export class QuizComponent implements OnInit {
  quizFormGroup!: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly quizService: QuizService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  /**
   * Defines controls, values and validators for quiz form group.
   */
  initializeForm() {
    this.quizFormGroup = this.fb.group({
      title: ['', [Validators.required, noWhitespaceValidator]],
      questions: this.fb.array([]),
    });
    this.addNewQuestion();
  }

  /**
   * Returns the question control list.
   */
  get questions(): FormArray {
    return get(this.quizFormGroup.controls, 'questions') as FormArray;
  }

  /**
   * Adds a question from the list.
   */
  addNewQuestion() {
    const newQuestion: FormControl = this.fb.control({
      title: '',
      answers: [],
    });
    this.questions.insert(this.questions.length, newQuestion);
  }

  /**
   * Removes a question from the list.
   */
  deleteQuestion(i: number) {
    this.questions.removeAt(i);
  }

  /**
   * Redirectets to quiz list page.
   */
  backToQuizList() {
    this.router.navigate(['quiz-list']);
  }

  /**
   * Creates and makes the quiz public, then redirects to quiz list page.
   */
  publishQuiz() {
    const mergedValue: QuizModel = {
      ...this.quizFormGroup.getRawValue(),
      questions: this.questions.getRawValue()
    };

    this.quizService.createQuiz(mergedValue).pipe(take(1)).subscribe(() => {
      this.snackBar.open('Quiz has been successfully created', 'Close', {
        duration: 3000
      });
      this.backToQuizList();
    })
  }
}
