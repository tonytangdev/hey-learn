import { EntityManager } from 'typeorm';
import { TransactionTypeORM } from './transaction.typeorm';
import { QuestionRelationalEntity } from '../repositories/relational/entities/question.relational-entity';
import { QuestionRelationalRepository } from '../repositories/relational/repositories/question.relational.repository';

describe('TransactionTypeORM', () => {
  let mockEntityManager: jest.Mocked<EntityManager>;

  beforeEach(() => {
    mockEntityManager = {
      getRepository: jest.fn(),
    } as unknown as jest.Mocked<EntityManager>;
  });

  describe('getRepository', () => {
    it('should return QuestionRelationalRepository with correct entity', () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const mockQuestionRepo = {} as any;
      mockEntityManager.getRepository.mockImplementation((entity) => {
        if (entity === QuestionRelationalEntity) return mockQuestionRepo;
        return null as any;
      });

      const transaction = new TransactionTypeORM(mockEntityManager);
      const dummyQuestionRepo = new QuestionRelationalRepository(
        mockQuestionRepo,
      );

      const result = transaction.getRepository(dummyQuestionRepo);

      expect(mockEntityManager.getRepository).toHaveBeenCalledWith(
        QuestionRelationalEntity,
      );
      expect(result).toBeInstanceOf(QuestionRelationalRepository);
    });

    it('should throw an error for unknown repository type', () => {
      class UnknownRepository {}
      const unknownRepo = new UnknownRepository();

      const transaction = new TransactionTypeORM(mockEntityManager);

      expect(() => transaction.getRepository(unknownRepo as any)).toThrow(
        'Unknown repository type',
      );
    });
  });
});
