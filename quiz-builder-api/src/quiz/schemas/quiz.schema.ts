import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type QuizDocument = Quiz & Document;

class Answer {
  @Prop({ required: true })
  text: string;

  @Prop()
  correct: boolean;
}

class Question {
  @Prop({ required: true })
  title: string;

  @Prop(() => [Answer])
  answers: Answer[];
}

@Schema()
export class Quiz {
  @Prop({ required: true })
  title: string;

  @Prop(() => [])
  questions: Question[];

  @Prop({ required: true })
  publicId: string;

  @Prop({ required: true })
  userId: number;
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);
