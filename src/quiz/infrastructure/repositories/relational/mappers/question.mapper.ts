import { Question } from '../../../../domain/entities/question.entity';
import { QuestionRelationalEntity } from '../entities/question.relational-entity';
import { Answer } from '../../../../domain/entities/answer.entity';
import { Organization } from '../../../../domain/entities/organization.entity';
import { AnswerRelationalEntity } from '../entities/answer.relational-entity';

export class QuestionMapper {
  static toDomain(
    questionRelationalEntity: QuestionRelationalEntity,
  ): Question {
    return new Question(
      questionRelationalEntity.value,
      new Organization(questionRelationalEntity.organization.id),
      questionRelationalEntity.propositions.map(
        (propositionRelationalEntity) =>
          new Answer(
            propositionRelationalEntity.value,
            propositionRelationalEntity.id,
            propositionRelationalEntity.isCorrect,
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
    relational.organizationId = question.organization.id;

    const propositionsRelational = question.propositions.map((proposition) => {
      const propositionRelational = new AnswerRelationalEntity();
      propositionRelational.id = proposition.id;
      propositionRelational.isCorrect = proposition.isCorrect;
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
