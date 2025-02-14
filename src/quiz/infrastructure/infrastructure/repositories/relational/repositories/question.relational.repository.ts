import { Injectable } from '@nestjs/common';
import { QuestionRepository } from '../../../../../application/repositories/question.repository';
import { Question } from '../../../../../domain/entities/question.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionRelationalEntity } from '../entities/question.relational-entity';
import { Repository } from 'typeorm';
import { AnswerRelationalEntity } from '../entities/answer.relational-entity';
import { OrganizationRelationalEntity } from '../entities/organization.relational-entity';
import { Organization } from '../../../../../domain/entities/organization.entity';
import { Answer } from '../../../../../domain/entities/answer.entity';

@Injectable()
export class QuestionRelationalRepository implements QuestionRepository {
  constructor(
    @InjectRepository(QuestionRelationalEntity)
    private readonly repository: Repository<QuestionRelationalEntity>,
  ) {}

  async save(question: Question): Promise<Question> {
    const questionRelationalEntity = new QuestionRelationalEntity();
    questionRelationalEntity.id = question.id;
    questionRelationalEntity.value = question.value;
    questionRelationalEntity.category = question.category ?? null;
    questionRelationalEntity.createdAt = question.createdAt;
    questionRelationalEntity.updatedAt = question.updatedAt;
    questionRelationalEntity.deletedAt = question.deletedAt ?? null;

    const organizationRelationalEntity = new OrganizationRelationalEntity();
    organizationRelationalEntity.id = question.organization.id;
    questionRelationalEntity.organization = organizationRelationalEntity;

    const answerRelationalEntity = new AnswerRelationalEntity();
    answerRelationalEntity.id = question.answer.id;
    answerRelationalEntity.value = question.answer.value;
    answerRelationalEntity.createdAt = question.answer.createdAt;
    answerRelationalEntity.updatedAt = question.answer.updatedAt;
    answerRelationalEntity.deletedAt = question.answer.deletedAt ?? null;
    questionRelationalEntity.answer = answerRelationalEntity;

    const propositionsRelationalEntities = question.propositions.map(
      (proposition) => {
        const propositionRelationalEntity = new AnswerRelationalEntity();
        propositionRelationalEntity.id = proposition.id;
        propositionRelationalEntity.value = proposition.value;
        propositionRelationalEntity.createdAt = proposition.createdAt;
        propositionRelationalEntity.updatedAt = proposition.updatedAt;
        propositionRelationalEntity.deletedAt = proposition.deletedAt ?? null;
        return propositionRelationalEntity;
      },
    );
    questionRelationalEntity.propositions = propositionsRelationalEntities;

    const savedQuestionRelationalEntity = await this.repository.save(
      questionRelationalEntity,
    );

    const savedQuestion = new Question(
      savedQuestionRelationalEntity.value,
      new Organization(savedQuestionRelationalEntity.organization.id),
      new Answer(
        savedQuestionRelationalEntity.answer.value,
        savedQuestionRelationalEntity.answer.id,
        savedQuestionRelationalEntity.answer.createdAt,
        savedQuestionRelationalEntity.answer.updatedAt,
        savedQuestionRelationalEntity.answer.deletedAt ?? undefined,
      ),
      savedQuestionRelationalEntity.propositions.map(
        (propositionRelationalEntity) =>
          new Answer(
            propositionRelationalEntity.value,
            propositionRelationalEntity.id,
            propositionRelationalEntity.createdAt,
            propositionRelationalEntity.updatedAt,
            propositionRelationalEntity.deletedAt ?? undefined,
          ),
      ),
    );

    return savedQuestion;
  }
}
