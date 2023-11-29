export class CreateQuizDto {
  readonly title: string;
  readonly questions: {
    readonly title: string;
    readonly answers: {
      readonly text: string;
      readonly correct: boolean;
    }[];
  }[];
  readonly publicId?: string;
  readonly userId?: number;
}
