import { Answer } from '../entities/answer.entity';
import { Organization } from '../entities/organization.entity';
import { Question } from '../entities/question.entity';

export class QuestionEntityBuilder {
  private id?: Question['id'];
  private value: Question['value'];
  private answer: Question['answer']['value'];
  private organizationId: Question['organization']['id'];
  private wrongPropositions: Answer['value'][] = [];
  private category: Question['category'];
  private createdAt?: Question['createdAt'];
  private updatedAt?: Question['updatedAt'];
  private deletedAt?: Question['deletedAt'];

  constructor(private readonly question: Question) {}

  withId(id: Question['id']): this {
    this.id = id;
    return this;
  }

  withValue(value: Question['value']): this {
    this.value = value;
    return this;
  }

  withAnswer(answer: Question['answer']['value']): this {
    this.answer = answer;
    return this;
  }

  withOrganizationId(organizationId: Question['organization']['id']): this {
    this.organizationId = organizationId;
    return this;
  }

  addWrongProposition(wrongPropositions: Answer['value']): this {
    this.wrongPropositions.push(wrongPropositions);
    return this;
  }

  withCategory(category: Question['category']): this {
    this.category = category;
    return this;
  }

  withCreatedAt(createdAt: Question['createdAt']): this {
    this.createdAt = createdAt;
    return this;
  }

  withUpdatedAt(updatedAt: Question['updatedAt']): this {
    this.updatedAt = updatedAt;
    return this;
  }

  withDeletedAt(deletedAt: Question['deletedAt']): this {
    this.deletedAt = deletedAt;
    return this;
  }

  build(): Question {
    const organization = new Organization(this.organizationId);

    const answer = new Answer(this.answer);

    const propositions = [answer].concat(
      this.wrongPropositions.map(
        (wrongProposition) => new Answer(wrongProposition),
      ),
    );

    return new Question(
      this.value,
      organization,
      answer,
      propositions,
      this.category,
      this.id,
      this.createdAt,
      this.updatedAt,
      this.deletedAt,
    );
  }
}
