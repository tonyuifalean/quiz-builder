import {
  AfterContentInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import get from 'lodash.get';
import { Subscription } from 'rxjs';

import { noWhitespaceValidator } from '../../../../utils';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: QuestionComponent,
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: QuestionComponent,
    },
  ],
})
export class QuestionComponent implements OnInit, AfterContentInit {
  @Input() formControlName!: number;

  @Output() deleteQuestionEvent: EventEmitter<any> = new EventEmitter<any>();

  questionFormGroup!: FormGroup;

  onChangeSubs: Subscription[] = [];

  /**
   * Returns answer form control list.
   */
  get answers(): FormArray {
    return get(this.questionFormGroup.controls, 'answers') as FormArray;
  }

  constructor(private readonly fb: FormBuilder) {}

  ngOnInit() {
    this.initializeForm();
  }

  /**
   * Adds by default two answers to the list.
   */
  ngAfterContentInit() {
    this.addNewAnswer();
    this.addNewAnswer();
  }

  /**
   * Defines controls, values and validators for question form group.
   */
  initializeForm() {
    this.questionFormGroup = this.fb.group({
      title: ['', [Validators.required, noWhitespaceValidator]],
      answers: this.fb.array([]),
    });
  }

  writeValue(value: any): void {
    if (value) {
      this.questionFormGroup.setValue(value, { emitEvent: false });
    }
  }

  registerOnChange(onChange: any): void {
    const sub = this.questionFormGroup.valueChanges.subscribe(onChange);
    this.onChangeSubs.push(sub);
  }

  registerOnTouched(fn: any): void {}

  setDisabledState?(isDisabled: boolean): void {}

  validate(control: AbstractControl): ValidationErrors | null {
    if (this.questionFormGroup.valid) {
      return null;
    }

    return { title: 'Title is required' };
  }

  /**
   * Defines control errors.
   */
  addControlErrors(allErrors: any, controlName: string) {
    const errors = { ...allErrors };
    const controlErrors = this.questionFormGroup.controls[controlName].errors;

    if (controlErrors) {
      errors[controlName] = controlErrors;
    }

    return errors;
  }

  /**
   * Add a new answer to the list.
   */
  addNewAnswer() {
    const newAnswer: FormControl = this.fb.control({
      text: '',
      correct: false,
    });
    this.answers.insert(this.answers.length, newAnswer);
  }

  /**
   * Emits delete question event.
   */
  deleteQuestion() {
    this.deleteQuestionEvent.emit();
  }

  /**
   * Removes and answer from the list.
   */
  deleteAnswer(i: number) {
    this.answers.removeAt(i);
  }
}
