import { faker } from '@faker-js/faker';
import { Question } from './question.entity';
import { Organization } from './organization.entity';
import { randomUUID } from 'node:crypto';
import { Answer } from './answer.entity';
import { MissingQuestionValueError } from '../errors/missing-question-value.error';
import { MissingQuestionPropositionsError } from '../errors/missing-question-propositions.error';
import { QuestionEntityBuilder } from '../entities-builders/question.entity-builder';

describe('Question', () => {
  it.each([
    {
      category: undefined,
      id: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      deletedAt: undefined,
    },
    {
      category: 'category',
      id: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      deletedAt: undefined,
    },
    {
      category: undefined,
      id: 'id',
      createdAt: undefined,
      updatedAt: undefined,
      deletedAt: undefined,
    },
    {
      category: undefined,
      id: undefined,
      createdAt: new Date(),
      updatedAt: undefined,
      deletedAt: undefined,
    },
    {
      category: undefined,
      id: undefined,
      createdAt: undefined,
      updatedAt: new Date(),
      deletedAt: undefined,
    },
    {
      category: undefined,
      id: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      deletedAt: new Date(),
    },
  ])(
    'should create a question',
    ({ category, id, createdAt, updatedAt, deletedAt }) => {
      const text = faker.lorem.sentence();
      const organization = new Organization(randomUUID());
      const wrongAnswers = Array.from(
        { length: 4 },
        () => new Answer(faker.lorem.sentence()),
      );

      const questionBuilder = new QuestionEntityBuilder()
        .withValue(text)
        .withOrganizationId(organization.id)
        .withAnswer(wrongAnswers[0].value);

      wrongAnswers.forEach((proposition) => {
        questionBuilder.addWrongAnswer(proposition.value);
      });

      if (category) {
        questionBuilder.withCategory(category);
      }

      if (id) {
        questionBuilder.withId(id);
      }

      if (createdAt) {
        questionBuilder.withCreatedAt(createdAt);
      }

      if (updatedAt) {
        questionBuilder.withUpdatedAt(updatedAt);
      }

      if (deletedAt) {
        questionBuilder.withDeletedAt(deletedAt);
      }

      const question = questionBuilder.build();

      expect(question).toBeInstanceOf(Question);
      expect(question.value).toBe(text);
      expect(question.organization.id).toBe(organization.id);
      expect(question.propositions.length).toEqual(wrongAnswers.length + 1);
      expect(question.category).toEqual(category);
    },
  );

  it('should throw an error if the question text is empty', () => {
    const text = ' ';
    const organization = new Organization(randomUUID());
    const propositions = Array.from(
      { length: 4 },
      () => new Answer(faker.lorem.sentence()),
    );
    expect(() => {
      new Question(text, organization, propositions);
    }).toThrow(new MissingQuestionValueError());
  });

  it('should throw an error if the number of propositions is less than 2', () => {
    const text = faker.lorem.sentence();
    const organization = new Organization(randomUUID());
    const propositions = Array.from(
      { length: 1 },
      () => new Answer(faker.lorem.sentence()),
    );
    expect(() => {
      new Question(text, organization, propositions);
    }).toThrow(new MissingQuestionPropositionsError());
  });

  it('should get the answer', () => {
    const text = faker.lorem.sentence();
    const organization = new Organization(randomUUID());
    const propositions = Array.from(
      { length: 4 },
      (_, i) => new Answer(faker.lorem.sentence(), undefined, i === 0),
    );
    const question = new Question(text, organization, propositions);
    expect(question.getAnswer()).toBe(propositions[0].value);
  });
});
