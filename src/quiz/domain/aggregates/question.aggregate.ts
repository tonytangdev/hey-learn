import { Question } from '../entities/question.entity';
import { QuestionEntityBuilder } from '../entities-builders/question.entity-builder';
import { Organization } from '../entities/organization.entity';
import { QuestionGeneration } from '../entities/question-generation.entity';

export class QuestionAggregate {
  constructor(private readonly question: Question) {}

  static create(
    questionText: string,
    answer: string,
    wrongAnswers: string[],
    organizationId: Organization['id'],
    questionGeneration: QuestionGeneration,
    category?: string,
  ) {
    const questionBuilder = new QuestionEntityBuilder()
      .withValue(questionText)
      .withAnswer(answer)
      .withOrganizationId(organizationId)
      .withQuestionGeneration(questionGeneration);

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
