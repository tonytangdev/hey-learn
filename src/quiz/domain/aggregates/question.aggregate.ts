import { Question } from '../entities/question.entity';
import { QuestionEntityBuilder } from '../entities-builders/question.entity-builder';
import { Organization } from '../entities/organization.entity';

export class QuestionAggregate {
  constructor(private readonly question: Question) {}

  static create(
    questionText: string,
    answer: string,
    wrongAnswers: string[],
    organizationId: Organization['id'],
    category?: string,
  ) {
    const questionBuilder = new QuestionEntityBuilder()
      .withValue(questionText)
      .withAnswer(answer)
      .withOrganizationId(organizationId);

    if (category) {
      questionBuilder.withCategory(category);
    }

    wrongAnswers.forEach((wrongAnswer) =>
      questionBuilder.addWrongAnswer(wrongAnswer),
    );

    const question = questionBuilder.build();
    return new QuestionAggregate(question);
  }

  getQuestion() {
    return this.question;
  }

  getAnswer() {
    return this.question.getAnswer();
  }

  getPropositions() {
    return this.question.propositions;
  }

  getCategory() {
    return this.question.category;
  }

  getOrganization() {
    return this.question.organization;
  }
}
