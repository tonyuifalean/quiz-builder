import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { QuizService } from './quiz.service';

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @UseGuards(JwtAuthGuard)
  @Get('list')
  getQuizList(@Request() req) {
    return this.quizService.getQuizList(req.user.userId);
  }

  @Get('public/:id')
  async getPublicQuiz(@Param('id') id: string) {
    const publicQuiz = await this.quizService.getPublicQuiz(id);
    if (publicQuiz) {
      return publicQuiz;
    } else {
      throw new BadRequestException('Quiz not found');
    }
  }

  @Post('public/:id/validate')
  async validatePublicQuiz(
    @Param('id') id: string,
    @Body() body: [{ id: number; value: boolean[] }],
  ) {
    const publicQuiz = await this.quizService.getPublicQuiz(id, true);
    if (publicQuiz) {
      let scoreValue = 0;
      body.forEach((question) => {
        const questionValue = question.value;
        const correctAnswers = publicQuiz.questions
          .find((ques, i) => i === question.id)
          ?.answers.filter((answer) => answer.correct)
          .map((answer) => answer.text);
        if (correctAnswers && correctAnswers.length === question.value.length) {
          correctAnswers.sort();
          questionValue.sort();
          if (
            JSON.stringify(correctAnswers) === JSON.stringify(questionValue)
          ) {
            scoreValue++;
          }
        }
      });
      return scoreValue;
    } else {
      throw new BadRequestException('Quiz not found');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteQuiz(@Param('id') id: string, @Request() req) {
    await this.quizService.deleteQuiz(id, req.user.userId);
    return {
      msg: 'Quiz successfully deleted',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('')
  async addQuiz(@Body() body: CreateQuizDto, @Request() req) {
    const createQuizData: CreateQuizDto = {
      ...body,
      userId: req.user.userId,
    };
    await this.quizService.insertQuiz(createQuizData);
    return {
      msg: 'Quiz successfully added',
    };
  }
}
