export interface QuizModel {
  id?: string;
  questions: QuestionModel[];
  publicId: string;
  title: string;
}

export interface QuestionModel {
  title: string;
  answers: AnswerModel[];
}

export interface AnswerModel {
  text: string;
  correct: boolean;
}

export interface QuizModelResponse {
  msg: string;
}
