import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { Quiz, QuizDocument } from './schemas/quiz.schema';

@Injectable()
export class QuizService {
  constructor(
    @InjectModel(Quiz.name) private readonly quizModel: Model<QuizDocument>,
  ) {}

  async insertQuiz(createQuizDto: CreateQuizDto) {
    const quizData = {
      ...createQuizDto,
      publicId: Math.random().toString(36).slice(2, 8),
    };
    const newQuiz = new this.quizModel(quizData);
    await newQuiz.save();
    return newQuiz;
  }

  getQuizList(userId: number) {
    return this.quizModel.find({ userId }).exec();
  }

  async getPublicQuiz(publicId: string, full = false) {
    return this.quizModel
      .findOne({ publicId })
      .select(
        `publicId title 
        ${!full ? 'questions.title questions.answers.text' : 'questions'}`,
      )
      .exec();
  }

  deleteQuiz(publicId: string, userId: number) {
    return this.quizModel.findOneAndDelete({ publicId, userId }).exec();
  }
}
