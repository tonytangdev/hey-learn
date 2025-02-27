import { Repository } from '../../../shared/interfaces/repository';
import { Transaction } from '../../../shared/interfaces/transaction';
import { EntityManager } from 'typeorm';
import { QuestionRelationalRepository } from '../repositories/relational/repositories/question.relational.repository';
import { QuestionRelationalEntity } from '../repositories/relational/entities/question.relational-entity';
import { QuestionGenerationRelationalEntity } from '../repositories/relational/entities/question-generation.relational-entity';
import { QuestionGenerationRelationalRepository } from '../repositories/relational/repositories/question-generation.relational.repository';

export class TransactionTypeORM implements Transaction {
  constructor(private readonly entityManager: EntityManager) {}

  getRepository<T extends Repository>(repository: T): T {
    if (repository instanceof QuestionRelationalRepository) {
      return new QuestionRelationalRepository(
        this.entityManager.getRepository(QuestionRelationalEntity),
      ) as unknown as T;
    } else if (repository instanceof QuestionGenerationRelationalRepository) {
      return new QuestionGenerationRelationalRepository(
        this.entityManager.getRepository(QuestionGenerationRelationalEntity),
      ) as unknown as T;
    }
    throw new Error('Unknown repository type');
  }
}
