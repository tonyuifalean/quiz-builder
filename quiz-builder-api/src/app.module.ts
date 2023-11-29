import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AuthModule } from './auth';
import { QuizModule } from './quiz/quiz.module';
import { UserModule } from './user';

@Module({
  imports: [
    AuthModule,
    UserModule,
    QuizModule,
    MongooseModule.forRoot('mongodb://localhost/quiz_demo'),
  ],
  controllers: [AppController],
})
export class AppModule {}
