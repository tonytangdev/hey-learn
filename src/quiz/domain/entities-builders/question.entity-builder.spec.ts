import { randomUUID } from 'node:crypto';
import { QuestionEntityBuilder } from './question.entity-builder';
import { faker } from '@faker-js/faker';
import { MissingQuestionValueError } from '../errors/missing-question-value.error';
import { MissingAnswerError } from '../errors/missing-answer-value.error';
import { MissingQuestionPropositionsError } from '../errors/missing-question-propositions.error';

describe('Question Entity Builder', () => {
  it.each([
    {
      id: randomUUID(),
      answer: faker.lorem.sentence(),
      category: faker.lorem.word(),
      questionText: faker.lorem.sentence(),
      organizationId: randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date(),
      wrongAnswers: [faker.lorem.sentence(), faker.lorem.sentence()],
    },
    {
      id: undefined,
      answer: faker.lorem.sentence(),
      category: faker.lorem.word(),
      questionText: faker.lorem.sentence(),
      organizationId: randomUUID(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.past(),
      deletedAt: faker.date.past(),
      wrongAnswers: [faker.lorem.sentence()],
    },
    {
      id: randomUUID(),
      answer: faker.lorem.sentence(),
      category: undefined,
      questionText: faker.lorem.sentence(),
      organizationId: randomUUID(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.past(),
      deletedAt: undefined,
      wrongAnswers: [faker.lorem.sentence()],
    },
  ])(
    'should build a question entity',
    ({
      id,
      answer,
      category,
      questionText,
      organizationId,
      createdAt,
      updatedAt,
      deletedAt,
      wrongAnswers,
    }) => {
      const questionBuilder = new QuestionEntityBuilder();

      if (id) {
        questionBuilder.withId(id);
      }

      if (category) {
        questionBuilder.withCategory(category);
      }

      if (deletedAt) {
        questionBuilder.withDeletedAt(deletedAt);
      }

      wrongAnswers.forEach((wrongAnswer) => {
        questionBuilder.addWrongAnswer(wrongAnswer);
      });

      questionBuilder
        .withAnswer(answer)
        .withValue(questionText)
        .withOrganizationId(organizationId)
        .withCreatedAt(createdAt)
        .withUpdatedAt(updatedAt);

      const question = questionBuilder.build();

      expect(question.id).toBeTruthy();
      if (id) {
        expect(question.id).toBe(id);
      }
      expect(question.category).toBe(category);
      expect(question.value).toBe(questionText);
      expect(question.organization.id).toBe(organizationId);
      expect(question.createdAt).toBe(createdAt);
      expect(question.updatedAt).toBe(updatedAt);
      expect(question.deletedAt).toBe(deletedAt);
      expect(question.propositions.length).toBe(wrongAnswers.length + 1);
    },
  );

  it('should throw an error if the question is empty', () => {
    const questionBuilder = new QuestionEntityBuilder()
      .withOrganizationId(randomUUID())
      .withValue('     ')
      .withAnswer('answer');

    expect(() => questionBuilder.build()).toThrow(
      new MissingQuestionValueError(),
    );
  });

  it('should throw an error if the answer is empty', () => {
    const questionBuilder = new QuestionEntityBuilder()
      .withOrganizationId(randomUUID())
      .withValue('question')
      .withAnswer('     ');
    expect(() => questionBuilder.build()).toThrow(new MissingAnswerError());
  });

  it('should an error if the number of propositions is less than 2', () => {
    const questionBuilder = new QuestionEntityBuilder()
      .withOrganizationId(randomUUID())
      .withValue(faker.lorem.sentence())
      .withAnswer(faker.lorem.sentence());

    expect(() => questionBuilder.build()).toThrow(
      new MissingQuestionPropositionsError(),
    );
  });
});
