import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { initApp } from './init-app';
import { CreateQuizDTO } from '../src/quiz/application/dtos/create-quiz.dto';

describe.skip('QuizController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    app = await initApp(app);
  });

  it('/quiz (POST) - create quiz', () => {
    const payload: CreateQuizDTO = {
      answer: 'answer',
      question: 'question',
      organizationId: 'organizationId',
      userId: 'userId',
      wrongAnswers: ['wrongAnswer1', 'wrongAnswer2'],
      category: 'category',
    };

    return request(app.getHttpServer())
      .post('/quiz')
      .send(payload)
      .expect(HttpStatus.ACCEPTED);
  });

  it('/quiz (POST) - bad request', () => {
    const payload: CreateQuizDTO = {
      answer: 'answer',
      question: 'question',
      organizationId: 'organizationId',
      userId: 'userId',
      wrongAnswers: ['wrongAnswer1', 'wrongAnswer2'],
    };

    return request(app.getHttpServer())
      .post('/quiz')
      .send(payload)
      .expect(HttpStatus.BAD_REQUEST);
  });
});
