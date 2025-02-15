import { Repository } from '../../../shared/interfaces/repository';
import { Transaction } from '../../../shared/interfaces/transaction';
import { EntityManager } from 'typeorm';
import { QuestionRelationalRepository } from '../repositories/relational/repositories/question.relational.repository';
import { QuestionRelationalEntity } from '../repositories/relational/entities/question.relational-entity';
import { AnswerRelationalRepository } from '../repositories/relational/repositories/answer.relational.repository';
import { AnswerRelationalEntity } from '../repositories/relational/entities/answer.relational-entity';

export class TransactionTypeORM implements Transaction {
  constructor(private readonly entityManager: EntityManager) {}

  getRepository<T extends Repository>(repository: T): T {
    if (repository instanceof QuestionRelationalRepository) {
      return new QuestionRelationalRepository(
        this.entityManager.getRepository(QuestionRelationalEntity),
      ) as unknown as T;
    } else if (repository instanceof AnswerRelationalRepository) {
      return new AnswerRelationalRepository(
        this.entityManager.getRepository(AnswerRelationalEntity),
      ) as unknown as T;
    }
    throw new Error('Unknown repository type');
  }
}
