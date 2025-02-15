import { randomUUID } from 'node:crypto';
import { QuestionRelationalEntity } from '../entities/question.relational-entity';
import { faker } from '@faker-js/faker/.';
import { AnswerRelationalEntity } from '../entities/answer.relational-entity';
import { QuestionMapper } from './question.mapper';
import { Question } from '../../../../domain/entities/question.entity';
import { Answer } from '../../../../domain/entities/answer.entity';
import { Organization } from '../../../../domain/entities/organization.entity';
import { OrganizationRelationalEntity } from '../../../../../user/infrastructure/repositories/relational/entities/organization.relational-entity';

describe('Question Mapper', () => {
  it.each([
    {
      id: randomUUID(),
      value: faker.lorem.sentence(),
      category: faker.lorem.word(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.past(),
      deletedAt: faker.date.past(),
      organization: {
        id: randomUUID(),
      },
      answer: {
        id: randomUUID(),
        value: faker.lorem.sentence(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        deletedAt: faker.date.past(),
      },
      propositions: [
        {
          id: randomUUID(),
          value: faker.lorem.sentence(),
          createdAt: faker.date.past(),
          updatedAt: faker.date.past(),
          deletedAt: faker.date.past(),
        },
        {
          id: randomUUID(),
          value: faker.lorem.sentence(),
          createdAt: faker.date.past(),
          updatedAt: faker.date.past(),
          deletedAt: faker.date.past(),
        },
      ],
    },
    {
      id: randomUUID(),
      value: faker.lorem.sentence(),
      category: null,
      createdAt: faker.date.past(),
      updatedAt: faker.date.past(),
      deletedAt: null,
      organization: {
        id: randomUUID(),
      },
      answer: {
        id: randomUUID(),
        value: faker.lorem.sentence(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        deletedAt: null,
      },
      propositions: [
        {
          id: randomUUID(),
          value: faker.lorem.sentence(),
          createdAt: faker.date.past(),
          updatedAt: faker.date.past(),
          deletedAt: null,
        },
        {
          id: randomUUID(),
          value: faker.lorem.sentence(),
          createdAt: faker.date.past(),
          updatedAt: faker.date.past(),
          deletedAt: null,
        },
      ],
    },
  ])(
    'should map to domain entity',
    ({
      id,
      value,
      category,
      createdAt,
      updatedAt,
      deletedAt,
      organization,
      answer,
      propositions,
    }) => {
      const questionRelationalEntity = new QuestionRelationalEntity();
      questionRelationalEntity.id = id;
      questionRelationalEntity.value = value;
      questionRelationalEntity.category = category;
      questionRelationalEntity.createdAt = createdAt;
      questionRelationalEntity.updatedAt = updatedAt;
      questionRelationalEntity.deletedAt = deletedAt;

      const organizationRelationalEntity = new OrganizationRelationalEntity();
      organizationRelationalEntity.id = organization.id;
      questionRelationalEntity.organization = organizationRelationalEntity;

      const answerRelationalEntity = new AnswerRelationalEntity();
      answerRelationalEntity.id = answer.id;
      answerRelationalEntity.value = answer.value;
      answerRelationalEntity.createdAt = answer.createdAt;
      answerRelationalEntity.updatedAt = answer.updatedAt;
      answerRelationalEntity.deletedAt = answer.deletedAt ?? null;
      questionRelationalEntity.answer = answerRelationalEntity;

      const propositionsRelationalEntities = propositions.map(
        (proposition: {
          id: string;
          value: string;
          createdAt: Date;
          updatedAt: Date;
          deletedAt: Date | null;
        }) => {
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

      const question = QuestionMapper.toDomain(questionRelationalEntity);

      expect(question.id).toEqual(questionRelationalEntity.id);
      expect(question.value).toEqual(questionRelationalEntity.value);
      expect(question.createdAt).toEqual(questionRelationalEntity.createdAt);
      expect(question.updatedAt).toEqual(questionRelationalEntity.updatedAt);
      expect(question.deletedAt).toEqual(
        questionRelationalEntity.deletedAt ?? undefined,
      );
      expect(question.answer.id).toEqual(answerRelationalEntity.id);
      expect(question.answer.value).toEqual(answerRelationalEntity.value);
      expect(question.answer.createdAt).toEqual(
        answerRelationalEntity.createdAt,
      );
      expect(question.answer.updatedAt).toEqual(
        answerRelationalEntity.updatedAt,
      );
      expect(question.answer.deletedAt).toEqual(
        answerRelationalEntity.deletedAt ?? undefined,
      );
      expect(question.propositions.length).toEqual(
        propositionsRelationalEntities.length,
      );
      question.propositions.forEach((proposition, index) => {
        expect(proposition.id).toEqual(
          propositionsRelationalEntities[index].id,
        );
        expect(proposition.value).toEqual(
          propositionsRelationalEntities[index].value,
        );
        expect(proposition.createdAt).toEqual(
          propositionsRelationalEntities[index].createdAt,
        );
        expect(proposition.updatedAt).toEqual(
          propositionsRelationalEntities[index].updatedAt,
        );
        expect(proposition.deletedAt).toEqual(
          propositionsRelationalEntities[index].deletedAt ?? undefined,
        );
      });
    },
  );

  it('should map to relational entity', () => {
    const organization = new Organization(randomUUID());
    const answer = new Answer(faker.lorem.sentence());
    const propositions = [answer, new Answer(faker.lorem.sentence())];

    const question = new Question(
      faker.lorem.sentence(),
      organization,
      answer,
      propositions,
      faker.lorem.sentence(),
    );

    const questionRelationalEntity = QuestionMapper.toRelational(question);

    expect(questionRelationalEntity.id).toEqual(question.id);
    expect(questionRelationalEntity.value).toEqual(question.value);
    expect(questionRelationalEntity.organization.id).toEqual(
      question.organization.id,
    );
    expect(questionRelationalEntity.answer.id).toEqual(question.answer.id);
    expect(questionRelationalEntity.createdAt).toEqual(question.createdAt);
    expect(questionRelationalEntity.updatedAt).toEqual(question.updatedAt);
    expect(questionRelationalEntity.deletedAt).toEqual(
      question.deletedAt ?? null,
    );
    expect(questionRelationalEntity.propositions.length).toEqual(
      question.propositions.length,
    );
    questionRelationalEntity.propositions.forEach((proposition, index) => {
      expect(proposition.id).toEqual(question.propositions[index].id);
      expect(proposition.value).toEqual(question.propositions[index].value);
      expect(proposition.createdAt).toEqual(
        question.propositions[index].createdAt,
      );
      expect(proposition.updatedAt).toEqual(
        question.propositions[index].updatedAt,
      );
      expect(proposition.deletedAt).toEqual(
        question.propositions[index].deletedAt ?? null,
      );
    });
  });
});
