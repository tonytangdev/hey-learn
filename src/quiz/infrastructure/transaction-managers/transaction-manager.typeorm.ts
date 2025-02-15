import { Injectable } from '@nestjs/common';
import { TransactionManager } from '../../../shared/interfaces/transaction-manager';
import { DataSource } from 'typeorm';
import { Transaction } from '../../../shared/interfaces/transaction';
import { TransactionTypeORM } from './transaction.typeorm';

@Injectable()
export class TransactionManagerTypeORM implements TransactionManager {
  constructor(private readonly dataSource: DataSource) {}

  async execute<T>(
    operation: (transaction: Transaction) => Promise<T>,
  ): Promise<T> {
    return this.dataSource.transaction(async (entityManager) => {
      const transaction = new TransactionTypeORM(entityManager);
      return operation(transaction);
    });
  }
}
