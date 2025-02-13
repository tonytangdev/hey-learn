import { faker } from '@faker-js/faker/.';
import { QuestionEntityBuilder } from '../entity-builders/question.entity-builder';
import { QuestionAggregate } from './question.aggregate';
import { randomUUID } from 'node:crypto';

describe('Question Aggregate', () => {
  const questionText = faker.lorem.sentence();
  const answer = faker.lorem.sentence();
  const wrongAnswer = faker.lorem.sentence();
  const organizationId = randomUUID();
  const category = faker.lorem.word();

  it('should initialize', () => {
    const question = new QuestionEntityBuilder()
      .withQuestion(questionText)
      .withAnswer(answer)
      .addWrongAnswer(wrongAnswer)
      .withOrganizationId(organizationId)
      .withCategory(category)
      .build();

    const questionBuilder = new QuestionAggregate(question);

    expect(questionBuilder).toBeInstanceOf(QuestionAggregate);
  });

  it('should create a question', () => {
    const questionAgg = QuestionAggregate.create(
      questionText,
      category,
      answer,
      [wrongAnswer],
      organizationId,
    );

    expect(questionAgg).toBeInstanceOf(QuestionAggregate);
    expect(questionAgg.getQuestion().value).toBe<string>(questionText);
    expect(questionAgg.getQuestion().category).toBe<string>(category);
    expect(questionAgg.getAnswer()).toBe<string>(answer);
    expect(questionAgg.getPropositions()).toHaveLength(2);
    expect(questionAgg.getOrganization().id).toBe<string>(organizationId);
    expect(questionAgg.getCategory()).toBe<string>(category);
  });
});
