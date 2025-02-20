import { faker } from '@faker-js/faker';
import { CreateQuizDTO } from './create-quiz.dto';
import { ValidationPipe } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

describe('QuizDTO', () => {
  it('should throw an error if question is empty', async () => {
    const quizDTO = new CreateQuizDTO();
    quizDTO.question = '';

    const validationPipe = new ValidationPipe();

    await expect(
      validationPipe.transform(quizDTO, {
        type: 'body',
        metatype: CreateQuizDTO,
      }),
    ).rejects.toThrow();
  });

  it('should throw an error if answer is empty', async () => {
    const quizDTO = new CreateQuizDTO();
    quizDTO.question = faker.lorem.sentence();
    quizDTO.answer = '';
    const validationPipe = new ValidationPipe();
    await expect(
      validationPipe.transform(quizDTO, {
        type: 'body',
        metatype: CreateQuizDTO,
      }),
    ).rejects.toThrow();
  });

  it('should throw an error if there are no wrong answers', async () => {
    const quizDTO = new CreateQuizDTO();
    quizDTO.question = faker.lorem.sentence();
    quizDTO.answer = faker.lorem.sentence();
    quizDTO.wrongAnswers = [];
    const validationPipe = new ValidationPipe();
    await expect(
      validationPipe.transform(quizDTO, {
        type: 'body',
        metatype: CreateQuizDTO,
      }),
    ).rejects.toThrow();
  });

  it('should throw an error if there is no organization', async () => {
    const quizDTO = new CreateQuizDTO();
    quizDTO.question = faker.lorem.sentence();
    quizDTO.answer = faker.lorem.sentence();
    quizDTO.wrongAnswers = [faker.lorem.sentence()];
    const validationPipe = new ValidationPipe();
    await expect(
      validationPipe.transform(quizDTO, {
        type: 'body',
        metatype: CreateQuizDTO,
      }),
    ).rejects.toThrow();
  });

  it('should throw an error if there is no userId', async () => {
    const quizDTO = new CreateQuizDTO();
    quizDTO.question = faker.lorem.sentence();
    quizDTO.answer = faker.lorem.sentence();
    quizDTO.wrongAnswers = [faker.lorem.sentence()];
    quizDTO.organizationId = randomUUID();
    const validationPipe = new ValidationPipe();
    await expect(
      validationPipe.transform(quizDTO, {
        type: 'body',
        metatype: CreateQuizDTO,
      }),
    ).rejects.toThrow();
  });

  it.each([
    {
      question: faker.lorem.sentence(),
      answer: faker.lorem.sentence(),
      wrongAnswers: [faker.lorem.sentence()],
      organizationId: randomUUID(),
    },
    {
      question: faker.lorem.sentence(),
      answer: faker.lorem.sentence(),
      wrongAnswers: [faker.lorem.sentence(), faker.lorem.sentence()],
      organizationId: randomUUID(),
      category: faker.lorem.sentence(),
    },
  ])('should not throw an error if all fields are valid', async () => {
    const quizDTO = new CreateQuizDTO();
    quizDTO.question = faker.lorem.sentence();
    quizDTO.answer = faker.lorem.sentence();
    quizDTO.wrongAnswers = [faker.lorem.sentence()];
    quizDTO.organizationId = randomUUID();
    quizDTO.category = faker.lorem.sentence();
    quizDTO.userId = randomUUID();

    const validationPipe = new ValidationPipe();

    await expect(
      validationPipe.transform(quizDTO, {
        type: 'body',
        metatype: CreateQuizDTO,
      }),
    ).resolves.not.toThrow();
  });
});
