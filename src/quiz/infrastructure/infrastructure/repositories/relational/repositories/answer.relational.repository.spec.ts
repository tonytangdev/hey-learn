import { Repository } from 'typeorm';
import { AnswerRelationalRepository } from './answer.relational.repository';
import { AnswerRelationalEntity } from '../entities/answer.relational-entity';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Answer } from '../../../../../domain/entities/answer.entity';
import { faker } from '@faker-js/faker';

describe('Answer Relational Repository', () => {
  let answerRelationalRepository: AnswerRelationalRepository;
  let mockRepository: Repository<AnswerRelationalEntity>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AnswerRelationalRepository,
        {
          provide: getRepositoryToken(AnswerRelationalEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    answerRelationalRepository = moduleRef.get<AnswerRelationalRepository>(
      AnswerRelationalRepository,
    );
    mockRepository = moduleRef.get<Repository<AnswerRelationalEntity>>(
      getRepositoryToken(AnswerRelationalEntity),
    );

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(answerRelationalRepository).toBeDefined();
  });

  it('should call save method of the repository', async () => {
    const answer = new Answer(faker.lorem.sentence());
    const answerRelationalEntity = new AnswerRelationalEntity();
    answerRelationalEntity.id = answer.id;
    answerRelationalEntity.value = answer.value;
    answerRelationalEntity.createdAt = answer.createdAt;
    answerRelationalEntity.updatedAt = answer.updatedAt;

    const spy = jest
      .spyOn(mockRepository, 'save')
      .mockResolvedValue(answerRelationalEntity);

    const res = await answerRelationalRepository.save(answer);

    expect(spy).toHaveBeenCalledWith(expect.any(AnswerRelationalEntity));
    expect(res).toBeInstanceOf(Answer);
  });
});
