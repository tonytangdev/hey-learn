import { Repository } from 'typeorm';
import { QuestionRelationalRepository } from './question.relational.repository';
import { QuestionRelationalEntity } from '../entities/question.relational-entity';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Question } from '../../../../../domain/entities/question.entity';
import { faker } from '@faker-js/faker';
import { Organization } from '../../../../../domain/entities/organization.entity';
import { randomUUID } from 'node:crypto';
import { Answer } from '../../../../../domain/entities/answer.entity';
import { AnswerRelationalEntity } from '../entities/answer.relational-entity';
import { OrganizationRelationalEntity } from '../entities/organization.relational-entity';

describe('Question Relational Repository', () => {
  let questionRelationalRepository: QuestionRelationalRepository;
  let mockRepository: Repository<QuestionRelationalEntity>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        QuestionRelationalRepository,
        {
          provide: getRepositoryToken(QuestionRelationalEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    questionRelationalRepository = moduleRef.get<QuestionRelationalRepository>(
      QuestionRelationalRepository,
    );
    mockRepository = moduleRef.get<Repository<QuestionRelationalEntity>>(
      getRepositoryToken(QuestionRelationalEntity),
    );

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(questionRelationalRepository).toBeInstanceOf(
      QuestionRelationalRepository,
    );
  });

  it('should save a question', async () => {
    const organization = new Organization(randomUUID());
    const answer = new Answer(faker.lorem.sentence());
    const propositions = [answer, new Answer(faker.lorem.sentence())];

    const question = new Question(
      faker.lorem.sentence(),
      organization,
      answer,
      propositions,
    );

    const questionRelationalEntity = new QuestionRelationalEntity();
    questionRelationalEntity.id = randomUUID();
    questionRelationalEntity.value = faker.lorem.sentence();
    questionRelationalEntity.answer = new AnswerRelationalEntity();
    questionRelationalEntity.answer.id = randomUUID();
    questionRelationalEntity.answer.value = faker.lorem.sentence();
    questionRelationalEntity.propositions = Array.from({ length: 2 }, () => {
      const proposition = new AnswerRelationalEntity();
      proposition.id = randomUUID();
      proposition.value = faker.lorem.sentence();
      return proposition;
    });
    questionRelationalEntity.organization = new OrganizationRelationalEntity();
    questionRelationalEntity.organization.id = randomUUID();

    const spy = jest
      .spyOn(mockRepository, 'save')
      .mockResolvedValueOnce(questionRelationalEntity);

    const res = await questionRelationalRepository.save(question);

    expect(spy).toHaveBeenCalledWith(expect.any(QuestionRelationalEntity));
    expect(res).toBeInstanceOf(Question);
  });
});
