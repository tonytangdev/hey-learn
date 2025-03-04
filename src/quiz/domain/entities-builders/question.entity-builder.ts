import { Answer } from '../entities/answer.entity';
import { Organization } from '../entities/organization.entity';
import { QuestionGeneration } from '../entities/question-generation.entity';
import { Question } from '../entities/question.entity';

export class QuestionEntityBuilder {
  private id: string;
  private createdAt: Date;
  private updatedAt: Date;
  private deletedAt?: Date;
  private value: string;
  private organizationId: string;
  private answer: string;
  private wrongAnswers: string[] = [];
  private category?: string;
  private questionGeneration: QuestionGeneration;

  withId(id: string) {
    this.id = id;
    return this;
  }

  withCreatedAt(createdAt: Date) {
    this.createdAt = createdAt;
    return this;
  }

  withUpdatedAt(updatedAt: Date) {
    this.updatedAt = updatedAt;
    return this;
  }

  withDeletedAt(deletedAt: Date) {
    this.deletedAt = deletedAt;
    return this;
  }

  withValue(value: string) {
    this.value = value;
    return this;
  }

  withOrganizationId(organizationId: Organization['id']) {
    this.organizationId = organizationId;
    return this;
  }

  withAnswer(answer: string) {
    this.answer = answer;
    return this;
  }

  addWrongAnswer(wrongAnswer: string) {
    this.wrongAnswers.push(wrongAnswer);
    return this;
  }

  withCategory(category: string) {
    this.category = category;
    return this;
  }

  withQuestionGeneration(questionGeneration: QuestionGeneration) {
    this.questionGeneration = questionGeneration;
    return this;
  }

  build() {
    const organization = new Organization(this.organizationId);
    const answer = new Answer(this.answer, undefined, true);
    const propositions = [answer].concat(
      this.wrongAnswers.map((wrongAnswer) => new Answer(wrongAnswer)),
    );

    // First create the Question instance without the QuestionGeneration
    const question = new Question(
      this.value,
      organization,
      propositions,
      this.questionGeneration,
      this.category,
      this.id,
      this.createdAt,
      this.updatedAt,
      this.deletedAt,
    );

    this.questionGeneration.setQuestion(question);
    return question;
  }
}
