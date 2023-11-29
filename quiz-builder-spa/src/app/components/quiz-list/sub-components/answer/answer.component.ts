import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';

import { noWhitespaceValidator } from '../../../../utils';

@Component({
  selector: 'app-answer',
  templateUrl: './answer.component.html',
  styleUrls: ['./answer.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: AnswerComponent,
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: AnswerComponent,
    },
  ],
})
export class AnswerComponent {
  @Input() formControlName!: number;

  @Output() deleteAnswerEvent: EventEmitter<any> = new EventEmitter<any>();

  answerFormGroup!: FormGroup;

  onChangeSubs: Subscription[] = [];

  constructor(private readonly fb: FormBuilder) {
    // Defines controls, values and validators for answer group form.
    this.answerFormGroup = this.fb.group({
      text: ['', [Validators.required, noWhitespaceValidator]],
      correct: [false],
    });
  }

  writeValue(value: any): void {
    if (value) {
      this.answerFormGroup.setValue(value, { emitEvent: false });
    }
  }

  registerOnChange(onChange: any): void {
    const sub = this.answerFormGroup.valueChanges
      .subscribe(onChange);
    this.onChangeSubs.push(sub);
  }

  registerOnTouched(fn: any): void {}

  setDisabledState?(isDisabled: boolean): void {}

  validate(control: AbstractControl): ValidationErrors | null {
    if (this.answerFormGroup.valid) {
      return null;
    }

    return {text: 'Text is required'};
  }

  /**
   * Emits delete answer event.
   */
  deleteAnswer() {
    this.deleteAnswerEvent.emit();
  }
}
