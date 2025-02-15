import { Question } from '../../../../domain/entities/question.entity';
import { QuestionRelationalEntity } from '../entities/question.relational-entity';
import { Answer } from '../../../../domain/entities/answer.entity';
import { Organization } from '../../../../domain/entities/organization.entity';
import { AnswerRelationalEntity } from '../entities/answer.relational-entity';
import { OrganizationRelationalEntity } from '../../../../../user/infrastructure/repositories/relational/entities/organization.relational-entity';

export class QuestionMapper {
  static toDomain(
    questionRelationalEntity: QuestionRelationalEntity,
  ): Question {
    return new Question(
      questionRelationalEntity.value,
      new Organization(questionRelationalEntity.organization.id),
      new Answer(
        questionRelationalEntity.answer.value,
        questionRelationalEntity.answer.id,
        questionRelationalEntity.answer.createdAt,
        questionRelationalEntity.answer.updatedAt,
        questionRelationalEntity.answer.deletedAt ?? undefined,
      ),
      questionRelationalEntity.propositions.map(
        (propositionRelationalEntity) =>
          new Answer(
            propositionRelationalEntity.value,
            propositionRelationalEntity.id,
            propositionRelationalEntity.createdAt,
            propositionRelationalEntity.updatedAt,
            propositionRelationalEntity.deletedAt ?? undefined,
          ),
      ),
      questionRelationalEntity.category ?? undefined,
      questionRelationalEntity.id,
      questionRelationalEntity.createdAt,
      questionRelationalEntity.updatedAt,
      questionRelationalEntity.deletedAt ?? undefined,
    );
  }

  static toRelational(question: Question): QuestionRelationalEntity {
    const relational = new QuestionRelationalEntity();
    relational.id = question.id;
    relational.value = question.value;
    relational.createdAt = question.createdAt;
    relational.updatedAt = question.updatedAt;
    relational.deletedAt = question.deletedAt ?? null;

    const organizationRelational = new OrganizationRelationalEntity();
    organizationRelational.id = question.organization.id;
    relational.organization = organizationRelational;

    const answerRelational = new AnswerRelationalEntity();
    answerRelational.id = question.answer.id;
    answerRelational.value = question.answer.value;
    answerRelational.createdAt = question.answer.createdAt;
    answerRelational.updatedAt = question.answer.updatedAt;
    answerRelational.deletedAt = question.answer.deletedAt ?? null;
    relational.answer = answerRelational;

    const propositionsRelational = question.propositions.map((proposition) => {
      const propositionRelational = new AnswerRelationalEntity();
      propositionRelational.id = proposition.id;
      propositionRelational.value = proposition.value;
      propositionRelational.createdAt = proposition.createdAt;
      propositionRelational.updatedAt = proposition.updatedAt;
      propositionRelational.deletedAt = proposition.deletedAt ?? null;
      return propositionRelational;
    });

    relational.propositions = propositionsRelational;
    return relational;
  }
}
